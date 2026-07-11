import { ResponseOf } from "@/server/api/responses";

type Courses = ResponseOf<'getApicourses'>;
type Course = Courses[number];

export type CourseLanguageGroup = {
    language: string;
    courses: Course[];
};

/**
 * Groups courses by their `language` field and returns the groups sorted
 * alphabetically by language title (case-insensitive).
 */
export const groupCoursesByLanguage = (courses?: Courses): CourseLanguageGroup[] => {
    if (!courses?.length) return [];

    const byLanguage = new Map<string, Course[]>();
    for (const course of courses) {
        const language = course.language ?? "";
        const group = byLanguage.get(language);
        if (group) {
            group.push(course);
        } else {
            byLanguage.set(language, [course]);
        }
    }

    return Array.from(byLanguage.entries())
        .map(([language, groupCourses]) => ({ language, courses: groupCourses }))
        .sort((a, b) => a.language.localeCompare(b.language, undefined, { sensitivity: "base" }));
};
