# Audio playback on web: diagnosis & fix

All audio in this app goes through `src/hooks/use-soundbyte.ts` on the web build
(expo-router + react-native-web, deployed via `npx expo export -p web && npx eas-cli deploy`).
This doc covers why audio behaves differently across browsers and the plan to make
`playOnMount` audio actually play on mount, including on iOS Chrome.

## Symptoms

- Audio plays reliably in Safari (iOS/desktop).
- Audio often fails in Google Chrome on iOS.
- Other browsers / Android untested.

## Root causes

### 1. A never-resumed `AudioContext` (the main one)

```ts
export const blobToAudioBuff = async (blob: Blob) => {
    const audioContext = new window.AudioContext();   // created with NO user gesture
    ...
    return {
        play: async () => {
            ...
            sourcenode.start(0);                       // never calls audioContext.resume()
        },
    };
};
```

Browsers start an `AudioContext` in the **`"suspended"` state** unless it's created
inside a user gesture. `sourceNode.start(0)` schedules audio on a suspended context —
it does **not** resume it. The only reliable way to resume is `audioContext.resume()`
called **inside a user-gesture handler** (tap/click).

- **Safari (WebKit)** is permissive in practice — contexts created outside gestures
  often still play when `start()` is later called, and mount-time autoplay is tolerated.
- **Chrome iOS** (WKWebView with Chrome's own autoplay policy layered on top) enforces
  the gesture requirement strictly. A context created during an async fetch stays
  suspended forever, so `play()` produces silence — even when `play()` itself is called
  inside a tap handler, because the context was created earlier without a gesture.

### 2. One `AudioContext` per sound, never closed

`loadSoundBytes` fetches and decodes **every exercise sound up front**, and each
`blobToAudioBuff` call creates a brand-new `AudioContext`:

```tsx
const ids = allExercises.flatMap(ex => ex.questionContent as string);
...
const sounds = await loadSoundBytes(ids as string[]);
```

None of those contexts are ever `close()`d. Chrome caps concurrent hardware contexts at
~6 — past that it logs `"The number of hardware contexts (6) has been exceeded"` and the
extra contexts are created but produce **no sound**. So on a long practice session with
many exercises, Chrome goes silent partway through while Safari keeps playing.

### 3. `playOnMount` fires with no user gesture at all

```tsx
const { play } = useSoundByte(exercise.questionContent!, { playOnMount: true });
```

`playOnMount` fires with **no user gesture** — unconditionally blocked by Chrome iOS
autoplay policy. Safari lets it slide.

### 4. Latent bug in `practice-session-summary.tsx`

```tsx
const sound = await createSoundByteRef("complete tone", { type: "mp3" });
await sound.playAsync();   // <-- createSoundByteRef returns { play, audioBuffer }, no playAsync
```

`playAsync` is `undefined` → this queryFn throws every time. Probably not the cause of
the Chrome issue (it's broken everywhere), but it's in the same feature area.

## The constraint

iOS Chrome will **never** autoplay audio with zero prior interaction on the page —
the engine enforces it. So "plays on mount" is only possible if the WebAudio context
has already been **unlocked by a user gesture**.

The good news: this app already has a gesture before every play we care about:

- The tap on "start practice" happens before the first `Question` mounts
- The tap on **Continue / Next Exercise** happens before every subsequent exercise change
- `Question` has `key={current.id}`, so each exercise change is a **fresh mount**, and
  `useSoundByte(exercise.questionContent!, { playOnMount: true })` re-runs its query with
  the new id → play-on-change is already wired

## The avenue: unlock the context once, then every mount plays

### 1. One shared `AudioContext` + unlock-on-gesture in `use-soundbyte.ts`

```ts
let sharedCtx: AudioContext | null = null;

const getAudioContext = () => {
  if (sharedCtx) return sharedCtx;
  sharedCtx = new AudioContext();

  // once the user touches/clicks anywhere, the context is unlocked for the page's lifetime
  const unlock = () => {
    if (!sharedCtx) return;
    if (sharedCtx.state === "suspended") {
      sharedCtx.resume().catch(() => {});
    } else if (sharedCtx.state === "running") {
      document.removeEventListener("touchend", unlock);
      document.removeEventListener("click", unlock);
    }
  };
  document.addEventListener("touchend", unlock);
  document.addEventListener("click", unlock);

  return sharedCtx;
};

export const blobToAudioBuff = async (blob: Blob) => {
  const audioContext = getAudioContext();          // reused, never recreated per fetch
  const arrayBuffer = await blob.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  return {
    play: async () => {
      if (audioContext.state === "suspended") {     // defensive, in case still locked
        try { await audioContext.resume(); } catch {}
      }
      const sourceNode = audioContext.createBufferSource();
      sourceNode.buffer = audioBuffer;
      sourceNode.connect(audioContext.destination);
      sourceNode.start(0);
    },
    audioBuffer,
  };
};
```

Once `resume()` succeeds inside a gesture, the context stays `"running"` for the page
lifetime. Every later `playOnMount` call — no matter how async — plays instantly,
because `start(0)` on a running context needs no gesture.

### 2. Attach the unlock listener at app root

Small module imported from `src/app/_layout.tsx` so the very first tap in the app — the
one that starts the practice session — unlocks audio. If you only attach it in
`use-soundbyte.ts`, the module loads *after* that tap (lazy chunk), and exercise 1's
mount-time play could miss the unlock window.

```ts
// src/lib/audio-unlock.ts — imported once from _layout.tsx
import { getAudioContext } from "@/hooks/use-soundbyte";
const unlock = () => getAudioContext().resume().catch(() => {});
document.addEventListener("touchend", unlock, { once: true });
document.addEventListener("click", unlock, { once: true });
```

(`{ once: true }` is enough — one successful resume unlocks permanently.)

## Resulting behavior

- Exercise 1: user taps "start practice" → context unlocked → Question mounts →
  fetch/decode → `play()` → **plays in iOS Chrome** ✓
- Every exercise change: tap "Continue" → new `Question` mounts (`key={current.id}`) →
  new query → `play()` → plays ✓
- Bonus: this also fixes the Chrome ~6-AudioContexts cap, since every sound now shares
  one context.

## What this can't do

If someone deep-links straight into a practice session with **zero** prior tap anywhere
in the app, iOS Chrome will still block exercise 1's audio. That's a hard browser policy,
not a code problem. Everything after the first tap works.

## Suggested cleanup (same area)

- **Drop or defer `playOnMount`** where possible — or rely on the unlock pattern above.
- **Don't load every exercise sound at once** — decode lazily per exercise, or at minimum
  reuse the shared context.
- **Fix the summary bug**: call `sound.play()` instead of `sound.playAsync()` in
  `practice-session-summary.tsx`.
- **To confirm on a Chrome device**: log `audioContext.state` right before `start(0)` —
  expect `"suspended"` in Chrome and `"running"` in Safari. Also watch the Chrome console
  for the hardware-context warning.

## Verification

- Test on iOS Chrome: start a practice session, confirm the question audio plays on the
  first exercise and on every exercise change.
- Test on iOS Safari: confirm nothing regressed.
- Check the Chrome console for the `"The number of hardware contexts (6) has been exceeded"`
  warning — should be gone after the singleton change.
