import { API, apiClient } from "@/server/api/client";
import { useQuery } from "@tanstack/react-query";

type SoundByteOpts = { type: "mp3" | "wav" }

export const blobToHTMLAudio = (blob: Blob) => {
    const audioUrl = URL.createObjectURL(blob);
    const audio = new Audio(audioUrl);
    audio.preload = "auto";
    return audio;
}

export const blobToSourceNode = async (blob: Blob) => {
    const audioContext = new window.AudioContext();

    const arrayBuffer = await blob.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    const sourceNode = audioContext.createBufferSource();
    sourceNode.buffer = audioBuffer;

    sourceNode.connect(audioContext.destination);
    return sourceNode;
}

export const playAudio = async (source: AudioBufferSourceNode) => {
    source.start(0);
}

export const createSoundByteRef = async (id: string, _opts = { type: "wav" }) => {
    // const media = await apiClient.getApimediaaudio({queries: { id: id.replaceAll(" ", "_") }})
    const response = await fetch(API + "/api/media/audio/blob?id=" + id.replaceAll(" ", "_"), {
        method: "GET",
    })

    const blob = await response.blob();

    const audioUrl = URL.createObjectURL(blob);
    const audio = new Audio(audioUrl);
    audio.preload = "auto";

    // return blobToHTMLAudio(blob);
    return blobToSourceNode(blob);
}

export const playBuffer = (audio: HTMLAudioElement) => {
    audio.play();
}

export const loadSoundBytes = async (ids: string[], opts = { type: "wav" }) => {
    const entries = await Promise.all(ids.map(async id => {
        try { return [id, await createSoundByteRef(id, opts)] as const }
        catch { return null } // ponytail: skip missing/failed sounds; playback no-ops on undefined
    }))
    return Object.fromEntries(entries.filter(Boolean) as [string, AudioBufferSourceNode][])
}

export const useSoundByte = (id: string, opts: SoundByteOpts & {playOnMount?: boolean} = { type: "wav" }) => {
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
