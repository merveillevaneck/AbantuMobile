import { ResponseOf } from "@/server/api/responses";
import { cn } from "@/tw/util";
import { ActivityIndicator, ScrollView } from "react-native";
import { CourseItem } from "./course-item";
import { router } from "expo-router";
import { Button } from "./button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { subscribeToCourse } from "@/server/subscribe-to-course";
import { getAvailableCoursesKey } from "@/server/get-available-courses";
import { myCoursesKey } from "@/server/get-my-courses";

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

     const queryClient = useQueryClient();
     const { mutateAsync: subscribe, isPending } = useMutation({
        mutationKey: ['subscribe-to-course'],
        mutationFn: subscribeToCourse,
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({queryKey: myCoursesKey}),
                queryClient.invalidateQueries({queryKey: getAvailableCoursesKey})
            ])
            router.back();
        }
     })

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
                    subscribeable
                    onSubscribe={() => router.back()}
                />
            ))}
        </ScrollView>
    )
}