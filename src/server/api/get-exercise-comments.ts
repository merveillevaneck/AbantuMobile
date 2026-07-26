import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./client";

export const getExerciseCommentsKey = (id: number) => ["GetApiExerciseComments", id];

export const getExerciseComments = (id: number) =>
    apiClient.getApiexercisesIdcomments({
        params: { id },
    });

export const useGetExerciseComments = (id: number | null | undefined, opts: { enabled?: boolean } = {}) =>
    useQuery({
        queryFn: () => getExerciseComments(id as number),
        queryKey: getExerciseCommentsKey(id as number),
        enabled: !!id && (opts.enabled ?? true),
    });
