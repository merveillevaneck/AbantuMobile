import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./client";
import { getExerciseCommentsKey } from "./get-exercise-comments";

type CreateCommentBody = Parameters<typeof apiClient.postApicommentscreate>[0];

export const createCommentKey = () => ["PostApiCommentsCreate"];

export const createComment = (body: CreateCommentBody) => apiClient.postApicommentscreate(body);

export type UseCreateCommentOpts = {
    onSuccess?: () => void;
};

export const useCreateComment = (props: UseCreateCommentOpts = {}) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createComment,
        mutationKey: createCommentKey(),
        onSuccess: async (_data, variables) => {
            if (variables.exerciseId) {
                await queryClient.invalidateQueries({
                    queryKey: getExerciseCommentsKey(variables.exerciseId),
                });
            }
            props?.onSuccess?.();
        },
    });
};
