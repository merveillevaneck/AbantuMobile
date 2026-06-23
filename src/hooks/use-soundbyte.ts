import { apiClient } from "@/server/api/client";
import { useQuery } from "@tanstack/react-query";
import { Audio } from 'expo-av';
import { useEffect } from "react";

type SoundByteOpts = { type: "mp3" | "wav" }

// ponytail: base64 -> object URL via fetch(dataURI).blob(); swap for FS file write later
const base64ToBlobUri = async (base64: string, type: string) => {
    const blob = await (await fetch(`data:audio/${type};base64,${base64}`)).blob()
    return URL.createObjectURL(blob)
}

export const createSoundByteRef = async (id: string, opts = { type: "wav" }) => {
    const media = await apiClient.getApimediaaudio({queries: { id: id.replaceAll(" ", "_") }})
    const uri = await base64ToBlobUri(media?.audio ?? "", opts.type)
    const { sound } = await Audio.Sound.createAsync({uri})

    return sound;
}

export const loadSoundBytes = async (ids: string[], opts = { type: "wav" }) => {
    const entries = await Promise.all(ids.map(async id => {
        try { return [id, await createSoundByteRef(id, opts)] as const }
        catch { return null } // ponytail: skip missing/failed sounds; playback no-ops on undefined
    }))
    return Object.fromEntries(entries.filter(Boolean) as [string, Awaited<ReturnType<typeof createSoundByteRef>>][])
}

export const useSoundByte = (id: string, opts: SoundByteOpts & {playOnMount?: boolean} = { type: "wav" }) => {
    const { data: soundRef, isPending } = useQuery({
        queryKey: ['sound', id],
        queryFn: async () => {
            const soundRef = await createSoundByteRef(id, opts);

            if (opts.playOnMount) await soundRef.playAsync();
            return soundRef
        },
        retry: false,
    })

    const play = async () => {
        if (!soundRef) return;
        await soundRef.playAsync();
    }

    useEffect(() => {
        return () => {
            if (!!soundRef) soundRef?.unloadAsync();
        }
    }, [])

    return {
        play,
        isPending
    }
}