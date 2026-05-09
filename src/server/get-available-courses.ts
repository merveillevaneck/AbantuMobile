import { apiClient } from "./api/client"

export const getAvailableCoursesKey = ['available-courses'];

export const getAvailableCourses = async () => {
    try {

        const result = await apiClient.getApistudentsubscribable();
        console.log('running')

        return result;
    } catch (e) {
        console.log('in error', e)
        throw new Error("couldnt fetch subscribable courses")
    }
}