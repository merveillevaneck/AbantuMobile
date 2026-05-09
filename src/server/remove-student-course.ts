import { apiClient } from "./api/client"

export const removeStudentCourseKey = ['remove-student-course'];

export const removeStudentCourse = async (courseId: number) => {
    const result = await apiClient.deleteApistudentcoursesId([], {
        params: {
            id: courseId
        }
    });

    return result;

}