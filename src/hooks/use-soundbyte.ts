import { apiClient } from "@/server/api/client";
import { useQuery } from "@tanstack/react-query";
import { Audio } from 'expo-av';
import { useEffect } from "react";

type SoundByteOpts = { type: "mp3" | "wav" }
export const createSoundByteRef = async (id: string, opts = { type: "wav" }) => {
    const media = await apiClient.getApimediaaudio({queries: { id: id.replaceAll(" ", "_") }})
    const uri = `data:audio/${opts.type};base64,${media?.audio}`
    const { sound } = await Audio.Sound.createAsync({uri})

    return sound;
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