import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./client"
import { getApiStudentCoursesKey } from "./get-student-courses";

type DeleteApiStudentCourseParams = {id: number;};

export const deleteApiStudentCourseKey = () => ["GetApiStudentCourse"];

export const deleteApiStudentCourse = (params: DeleteApiStudentCourseParams) => apiClient.deleteApistudentcoursesId(undefined, {
    params: {
        id: params.id,
    }
})

export type UseDeleteApiStudentCourseOpts = {
    onSuccess?: () => void;
}
export const useDeleteApiStudentCourse = (props: UseDeleteApiStudentCourseOpts = {}) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteApiStudentCourse,
        mutationKey: deleteApiStudentCourseKey(),
        onSuccess: () => {
                queryClient.invalidateQueries({queryKey: getApiStudentCoursesKey()})
                props?.onSuccess?.();
        }
    })
}

