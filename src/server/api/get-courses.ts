import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./client"

export const getCoursesKey = () => ["GetApiCouses"] 
export const getCourses = async () => await apiClient.getApicourses();

export const useGetApiCourses = () => useQuery({
    queryFn: getCourses,
    queryKey: getCoursesKey()
});
