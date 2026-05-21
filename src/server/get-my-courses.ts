import { apiClient } from "./api/client"

export const myCoursesKey = ['my-courses'];

export const getMyCourses = async () => {
    const result = await apiClient.getApistudentcourses();
    console.log('result', result)
    return result;
}