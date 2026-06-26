import { API, apiClient } from "@/server/api/client";
import { useQuery } from "@tanstack/react-query";

type SoundByteOpts = { type?: "mp3" | "wav" | "flac" }

export const blobToHTMLAudio = (blob: Blob) => {
    const audioUrl = URL.createObjectURL(blob);
    const audio = new Audio(audioUrl);
    audio.preload = "auto";
    return audio;
}

export const blobToAudioBuff = async (blob: Blob) => {
    const audioContext = new window.AudioContext();

    const arrayBuffer = await blob.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    return {
        play: async () => {
            const sourcenode = audioContext.createBufferSource();
            sourcenode.buffer = audioBuffer;
            sourcenode.connect(audioContext.destination);
            sourcenode.start(0);
        },
        audioBuffer: audioBuffer,
    };
}

export const playAudio = async (audio: Playable) => {
    audio.play();
}   

export const createSoundByteRef = async (id: string, opts: SoundByteOpts = {}) => {
    // const media = await apiClient.getApimediaaudio({queries: { id: id.replaceAll(" ", "_") }})
    const response = await fetch(`${API}/api/media/audio/blob?id=${id.replaceAll(" ", "_")}${opts.type ? `&type=${opts.type}` : ""}`, {
        method: "GET",
    });

    const blob = await response.blob();

    return blobToAudioBuff(blob);
}

export const playBuffer = (audio: HTMLAudioElement) => {
    audio.play();
}

export type Playable = {audioBuffer: AudioBuffer, play: () => Promise<void>}
export const loadSoundBytes = async (ids: string[], opts: SoundByteOpts = {}) => {
    const entries = await Promise.all(ids.map(async id => {
        try { return [id, await createSoundByteRef(id, opts)] as const }
        catch { return null } // ponytail: skip missing/failed sounds; playback no-ops on undefined
    }))
    return Object.fromEntries(entries.filter(Boolean) as [string, Playable][])
}

export const useSoundByte = (id: string, opts: SoundByteOpts & {playOnMount?: boolean}) => {
    const { data: soundRef, isPending } = useQuery({
        queryKey: ['sound', id],
        queryFn: async () => {
            const soundRef = await createSoundByteRef(id, opts);
            if (opts.playOnMount) playAudio(soundRef);
            return soundRef
        },
        retry: false,
    })

    const play = async () => {
        if (!soundRef) return;
        playAudio(soundRef);
    }

    return {
        play,
        isPending
    }
}
