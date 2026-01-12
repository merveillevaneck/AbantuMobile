import { ResponseOf } from "@/server/api/responses";
import { cn } from "@/tw/util";
import { ScrollView } from "react-native";
import { CourseItem } from "./course-item";
import { router } from "expo-router";

const navigateToCourseSummary = (id: number) => {
    router.push(`/student/courses/${id}`)
}

type Courses = ResponseOf<'getApicourses'>;
type MyCoursesDisplayProps = {
    className?: string;
    contentContainerClassName?: string;
    courses?: Courses;
    isLoading?: boolean;
}

export const MyCoursesDisplay = (props: MyCoursesDisplayProps) => {
    const { 
        className,
        contentContainerClassName,
        courses,
        isLoading,
     } = props;
    return (
        <ScrollView
            className={cn(
                "flex flex-1",
                className,
            )}
            contentContainerClassName={cn(
                "px-5 flex flex-col items-stretch gap-8",
                contentContainerClassName,
            )}
        >
            {courses?.map(course => (
                <CourseItem
                    key={course.id}
                    course={course}
                    onPress={() => navigateToCourseSummary(course.id)}
                    progress={0.5}
                />
            ))}
        </ScrollView>
    )
}