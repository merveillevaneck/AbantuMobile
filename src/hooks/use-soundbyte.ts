import { API, apiClient } from "@/server/api/client";
import { useQuery } from "@tanstack/react-query";

type SoundByteOpts = { type: "mp3" | "wav" }

// ponytail: single shared AudioContext; low-latency web playback from pre-decoded buffers
let ctx: AudioContext | null = null;
const audioCtx = () => (ctx ??= new (window.AudioContext || (window as any).webkitAudioContext)());

const base64ToArrayBuffer = (base64: string) => {
    const bin = atob(base64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes.buffer;
}

// ponytail: pass callbacks AND use the return value so older iOS Safari (no promise-form decodeAudioData) still resolves
const decode = (data: ArrayBuffer) => new Promise<AudioBuffer>((resolve, reject) => {
    const ret = audioCtx().decodeAudioData(data, resolve, reject);
    if (ret && typeof (ret as any).then === "function") (ret as Promise<AudioBuffer>).then(resolve, reject);
})

export const createSoundByteRef = async (id: string, _opts = { type: "wav" }) => {
    // const media = await apiClient.getApimediaaudio({queries: { id: id.replaceAll(" ", "_") }})
    const response = await fetch(API + "/api/media/audio/blob?id=" + id.replaceAll(" ", "_"), {
        method: "GET",
    })

    console.log('response', response)

    const blob = await response.blob();

    const audioUrl = URL.createObjectURL(blob);
    const audio = new Audio(audioUrl);

    return audio;
}

export const playBuffer = (audio: HTMLAudioElement) => {
    audio.play();
}

export const loadSoundBytes = async (ids: string[], opts = { type: "wav" }) => {
    const entries = await Promise.all(ids.map(async id => {
        try { return [id, await createSoundByteRef(id, opts)] as const }
        catch { return null } // ponytail: skip missing/failed sounds; playback no-ops on undefined
    }))
    return Object.fromEntries(entries.filter(Boolean) as [string, HTMLAudioElement][])
}

export const useSoundByte = (id: string, opts: SoundByteOpts & {playOnMount?: boolean} = { type: "wav" }) => {
    const { data: soundRef, isPending } = useQuery({
        queryKey: ['sound', id],
        queryFn: async () => {
            const soundRef = await createSoundByteRef(id, opts);
            if (opts.playOnMount) playBuffer(soundRef);
            return soundRef
        },
        retry: false,
    })

    const play = async () => {
        if (!soundRef) return;
        playBuffer(soundRef);
    }

    return {
        play,
        isPending
    }
}
