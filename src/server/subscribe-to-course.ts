import { apiClient } from "./api/client"

export const subscribeToCourseKey = ['subscribe-to-course'];

export const subscribeToCourse = async (id: number) => {
    const result = await apiClient.postApistudentcoursesId([], {
        params: {
            id
        }
    });

    return result;
}