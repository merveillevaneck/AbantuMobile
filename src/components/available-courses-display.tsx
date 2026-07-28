import { ResponseOf } from "@/server/api/responses";
import { cn } from "@/tw/util";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { CourseItem } from "./course-item";
import { groupCoursesByLanguage } from "./group-courses-by-language";
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
                "px-5 flex flex-col items-center gap-8",
                contentContainerClassName,
            )}
        >
            <View className="w-full max-w-[500px] flex flex-col gap-8">
                {groupCoursesByLanguage(courses).length === 0 ? (
                    <View className="flex flex-col items-center justify-center gap-4 py-20">
                        <Text className="text-white text-xl font-bold text-center">
                            No courses available
                        </Text>
                        <Text className="text-white/70 text-center">
                            There are no courses available to subscribe to right now. Check back later.
                        </Text>
                    </View>
                ) : (
                groupCoursesByLanguage(courses).map(group => (
                    <View key={group.language} className="flex flex-col items-stretch gap-4">
                        <Text className="text-white text-2xl font-bold">{group.language}</Text>
                        {group.courses.map(course => (
                            <CourseItem
                                key={course.id}
                                course={course}
                                onPress={() => navigateToCourseSummary(course.id)}
                                subscribeable
                                onSubscribe={() => router.back()}
                            />
                        ))}
                    </View>
                ))
                )}
            </View>
        </ScrollView>
    )
}