import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./client";

export const getApiStudentCoursesKey = () => ["GetApiStudentCourses"];

export const getApiStudentCouses = async () => {
    return apiClient.getApistudentcourses();
}

export const useGetApiStudentCourses = () => useQuery({
    queryFn: getApiStudentCouses,
    queryKey: getApiStudentCoursesKey(),
})