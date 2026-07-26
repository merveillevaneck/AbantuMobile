import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./client";
import { getExerciseCommentsKey } from "./get-exercise-comments";

export const useResolveComment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => apiClient.postApicommentsIdresolve(undefined, { params: { id } }),
        onSuccess: async (_data, _vars) => {
            await queryClient.invalidateQueries({ queryKey: ["GetApiExerciseComments"] });
        },
    });
};
