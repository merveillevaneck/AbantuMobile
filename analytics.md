# Session Analytics Implementation Plan

## Step 1 — Server wrappers

`src/server/api/session-start.ts`:
```ts
import { apiClient } from "./client";
import { useMutation } from "@tanstack/react-query";
import { ResponseOf } from "./responses";

type Params = { body: { unitId?: number } };
type Response = ResponseOf<"postApistudentsessionstart">;

export const postApiStudentSessionStartKey = () => ["PostApiStudentSessionStart"];
export const postApiStudentSessionStart = async (opts: Params): Promise<Response> =>
  await apiClient.postApistudentsessionstart(opts);

export const usePostApiStudentSessionStart = () =>
  useMutation({
    mutationFn: postApiStudentSessionStart,
    mutationKey: postApiStudentSessionStartKey(),
  });
```

`src/server/api/session-end.ts`:
```ts
import z from "zod";
import { schemas } from "./generated-client";
import { apiClient } from "./client";
import { useMutation } from "@tanstack/react-query";
import { ResponseOf } from "./responses";

const params = schemas.postApistudentsessionend_Body;
type Params = z.infer<typeof params>;
type Response = ResponseOf<"postApistudentsessionend">;

export const postApiStudentSessionEndKey = () => ["PostApiStudentSessionEnd"];
export const postApiStudentSessionEnd = async (opts: Params): Promise<Response> =>
  await apiClient.postApistudentsessionend(opts);

export const usePostApiStudentSessionEnd = () =>
  useMutation({
    mutationFn: postApiStudentSessionEnd,
    mutationKey: postApiStudentSessionEndKey(),
  });
```

Add to `src/server/api/index.ts`:
```ts
export * from './session-start';
export * from './session-end';
```

## Step 2 — `useStartSession` hook

`src/hooks/use-start-session.ts`:
```ts
import { uniqueId } from "lodash";
import { usePostApiStudentSessionStart } from "@/server/api";
import { usePracticeStore } from "@/store/practice";

type StartSessionArgs = { unitId: number };

export const useStartSession = () => {
  const start = usePracticeStore(s => s.start);
  const { mutateAsync, isPending, ...rest } = usePostApiStudentSessionStart();

  const startSession = async ({ unitId }: StartSessionArgs) => {
    const res = await mutateAsync({ body: { unitId } });
    const transformed = res.exercises.map(ex => ({
      ...ex,
      options: ex.options?.map(opt => ({ uuid: uniqueId(), text: opt })).sort(() => Math.random() - 0.5),
    }));
    start(transformed, res.sessionId!);
    return res;
  };

  return { startSession, isPending, ...rest };
};
```

## Step 3 — `StartSessionButton` component

`src/components/start-session-button.tsx`:
```tsx
import { router } from "expo-router";
import { ActivityIndicator } from "react-native";
import { Button } from "./button";
import { useStartSession } from "@/hooks/use-start-session";

export type StartSessionButtonProps = {
  unitId: number;
  courseId: number;
  unitType: "lesson" | "practice";
  className?: string;
  textClassName?: string;
};

export const StartSessionButton = (props: StartSessionButtonProps) => {
  const { unitId, courseId, unitType, className, textClassName } = props;
  const { startSession, isPending } = useStartSession();

  const handlePress = async () => {
    await startSession({ unitId });
    router.push(`/student/courses/${courseId}/practice/${unitId}`);
  };

  return (
    <Button
      className={className}
      textClassName={textClassName}
      text={isPending ? <ActivityIndicator color="white" /> : "practice"}
      isLoading={isPending}
      onPress={handlePress}
    />
  );
};
```

## Step 4 — Wire into unit items

`src/app/(app)/student/courses/[id]/index.tsx` — remove `handlePractice`, `navigateToPracticeSession`, and `getUnitExercises` import. Add:
```tsx
import { StartSessionButton } from "@/components/start-session-button";

{data?.units?.map(unit => (
    <UnitItem
        unit={unit}
        key={unit.id}
        progress={0.5}
        action={<StartSessionButton unitId={unit.id} courseId={Number(id)} unitType={unit.type} />}
    />
))}
```

## Step 5 — Extend practice store

`src/store/practice.ts`:
```ts
export type CompletedExercise = Exercise & {
  correct: boolean;
  answer: string[];
  startedAt: string;
  endedAt: string;
};

type PracticeStateFields = {
  exercises: Exercise[];
  completed: CompletedExercise[];
  current: Exercise | null;
  currentStartedAt: string | null;
  sessionId: number | null;
};

interface IPracticeState {
  start: (exercises: Exercise[], sessionId: number) => void;
  end: () => void;
  complete: (correct: boolean, answer: string[], endedAt: string) => void;
}

const DefaultStateValues: PracticeStateFields = {
  exercises: [],
  completed: [],
  current: null,
  currentStartedAt: null,
  sessionId: null,
};

const start = (exercises: Exercise[], sessionId: number) => {
  const state = { ...DefaultStateValues, exercises, sessionId };
  const firstExercise = determineNextExercise(state);
  const $exercises = firstExercise ? exercises.slice(1) : [];
  return {
    ...state,
    exercises: $exercises,
    current: firstExercise ?? null,
    currentStartedAt: firstExercise ? new Date().toISOString() : null,
  };
};

const completeCurrentExercise = (state: PracticeStateFields, correct: boolean, answer: string[], endedAt: string) => {
  const { completed, exercises, current, currentStartedAt } = state;
  const nextExercise = determineNextExercise(state);
  const $completed = current
    ? [...completed, { ...current, correct, answer, startedAt: currentStartedAt ?? endedAt, endedAt }]
    : completed;
  return {
    ...state,
    completed: $completed,
    current: nextExercise,
    currentStartedAt: nextExercise ? new Date().toISOString() : null,
    exercises: nextExercise ? exercises.slice(1) : exercises,
  };
};

// store:
end: () => set({ ...DefaultStateValues }),
complete: (correct, answer, endedAt) => set(state => completeCurrentExercise(state, correct, answer, endedAt)),
start: (exercises, sessionId) => set(start(exercises, sessionId)),
```

## Step 6 — Practice screen: audio-only load

`src/app/(app)/student/courses/[id]/practice/[unitId]/index.tsx` — replace the existing `useQuery` block (lines 46–62) with:
```ts
const { current, exercises, completed, sessionId, end } = usePracticeStore();
const allExercises = [...completed, ...(current ? [current] : []), ...exercises];
const ids = allExercises.flatMap(ex => ex.questionContent as string);

useQuery({
  queryKey: ["session-audio", sessionId],
  queryFn: async () => {
    if (sessionId == null) return;
    const sounds = await loadSoundBytes(ids as string[]);
    setSounds(sounds);
    setShowLoader(false);
    return sounds;
  },
  enabled: sessionId != null,
  refetchOnWindowFocus: false,
});
```

Remove `getUnitExercises` import. The `Exercise` type alias on line 233 — change to import from the store (or infer from store state):
```ts
type Exercise = CompletedExercise;
// or: import type { Exercise } from "@/store/practice"; (if we export it)
```

Loading animation (`LottieView` block) stays unchanged.

## Step 7 — Capture `endedAt` at Check press

In `handleCheck`:
```ts
const [submission, setSubmission] = useState<{correct: boolean, answer: string[], endedAt: string} | null>(null);

const handleCheck = async (opts: string[]) => {
  if (current?.answerType === "bubbles") {
    let match = false;
    current?.answers?.forEach(answer => {
      const bubbles = (answer?.text as string[]);
      if (_.isEqual(opts, bubbles)) match = true;
    });
    const endedAt = new Date().toISOString();
    if (!match) {
      setSubmission({ correct: false, answer: opts, endedAt });
      return sheet?.current?.expand();
    }
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    void playCorrect();
    setSubmission({ correct: true, answer: opts, endedAt });
    return sheet?.current?.expand();
  }
};
```

In the sheet's Continue onPress:
```ts
onPress={async () => {
  sheet?.current?.close();
  await new Promise(resolve => setTimeout(() => resolve(true), 400));
  setSubmission(null);
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  if (submission) complete(submission.correct, submission.answer, submission.endedAt);
}}
```

## Step 8 — Confirm dialog for mid-session back

In the practice screen:
```ts
import { Modal, Pressable } from "react-native";  // add to imports
import { usePostApiStudentSessionEnd } from "@/server/api";

const [showAbortDialog, setShowAbortDialog] = useState(false);
const { mutateAsync: endSession, isPending: isEnding } = usePostApiStudentSessionEnd();

const abortSession = async () => {
  setShowAbortDialog(false);
  if (sessionId != null) {
    await endSession({ body: { sessionId, answers: [] } });
  }
  end();
  router.back();
};
```

Change header:
```tsx
<PracticeSessionHeader
  className="lg:w-200 md:self-center m-4 p-2"
  progress={!finished ? progress : undefined}
  onBack={() => setShowAbortDialog(true)}
  onComments={() => commentsSheet?.current?.expand()}
/>
```

Add the modal (sibling of existing views):
```tsx
<Modal transparent visible={showAbortDialog} animationType="fade" onRequestClose={() => setShowAbortDialog(false)}>
  <Pressable className="flex-1 bg-black/60 justify-center items-center px-6" onPress={() => setShowAbortDialog(false)}>
    <Pressable className="bg-[#232427] rounded-2xl p-5 w-full max-w-md gap-4" onPress={e => e.stopPropagation()}>
      <Text className="text-white text-xl font-bold">End session?</Text>
      <Text className="text-white/70">
        If you leave now, your progress in this session will be lost.
      </Text>
      <View className="flex flex-row gap-3 mt-2">
        <Button className="flex-1 bg-transparent border border-[#333435]" text="Cancel" onPress={() => setShowAbortDialog(false)} />
        <Button className="flex-1 bg-red-500" text="End session" isLoading={isEnding} onPress={abortSession} />
      </View>
    </Pressable>
  </Pressable>
</Modal>
```

## Step 9 — Finish flow calls `/session/end` with answers

```ts
const handleFinishSubmit = async () => {
  if (sessionId != null) {
    await endSession({
      body: {
        sessionId,
        answers: completed.map(c => ({
          exerciseId: c.id,
          answer: c.answer,
          correct: c.correct,
          startedAt: c.startedAt,
          endedAt: c.endedAt,
        })),
      },
    });
  }
  end();
  router.back();
};

{finished && (
  <PracticeSessionSummary completed={completed} isSubmitting={isEnding} onSubmit={handleFinishSubmit} />
)}
```

## Step 10 — `PracticeSessionSummary` gets `isSubmitting` prop

`src/components/practice-session-summary.tsx`:
```ts
export type PracticeSessionSummaryProps = {
  completed: CompletedExercise[];
  isSubmitting?: boolean;
  onSubmit: () => void;
};

// remove the "todo: submit da stats tingies here" comment

<Button
  textClassName="text-2xl"
  text="Back to the course!"
  isLoading={isSubmitting}
  onPress={() => onSubmit()}
/>
```
