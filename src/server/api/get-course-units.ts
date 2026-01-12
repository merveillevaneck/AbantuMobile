import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./client"


type Input = Parameters<typeof apiClient.getApicoursesId>[0]['params'];

export const getCourseKey = (opts: Input) => ["GetApiCourse", opts.id] 
export const getApiCourse = async (opts: Input) => await apiClient.getApicoursesId({
    params: {
        id: opts.id,
    }
});

export const useGetApiCourse = (opts: Input) => useQuery({
    queryFn: async () => await getApiCourse(opts),
    queryKey: getCourseKey(opts),
});
