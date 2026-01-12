import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./client"

type GetApiStudentCourseParams = Parameters<typeof apiClient.getApistudentcoursesId>[0]['params']

export const getApiStudentCourseKey = (params: GetApiStudentCourseParams) => ["GetApiStudentCourse", params.id];

export const getApiStudentCourse = (params: GetApiStudentCourseParams) => apiClient.getApistudentcoursesId({
    params: {
        id: params.id
    }
})

export const useGetApiStudentCourse = (params: GetApiStudentCourseParams) => useQuery({
    queryFn: async () => getApiStudentCourse(params),
    queryKey: getApiStudentCourseKey(params),
})

