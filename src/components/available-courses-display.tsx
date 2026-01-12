import { ResponseOf } from "@/server/api/responses";
import { cn } from "@/tw/util";
import { ScrollView } from "react-native";
import { CourseItem } from "./course-item";
import { router } from "expo-router";
import { Button } from "./button";

const navigateToCourseSummary = (id: number) => {
    router.push(`/courses/${id}`)
}

type Courses = ResponseOf<'getApicourses'>;
type AvailableCoursesDisplayProps = {
    className?: string;
    contentContainerClassName?: string;
    courses?: Courses;
    isLoading?: boolean;
}

export const AvailableCoursesDisplay = (props: AvailableCoursesDisplayProps) => {
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
                    action={<Button text="Subscribe" onPress={() => alert("add course to thing")} />}
                />
            ))}
        </ScrollView>
    )
}