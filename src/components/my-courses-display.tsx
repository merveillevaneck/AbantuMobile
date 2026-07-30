import { ResponseOf } from "@/server/api/responses";
import { cn } from "@/tw/util";
import { ScrollView, Text, View } from "react-native";
import { CourseItem } from "./course-item";
import { groupCoursesByLanguage } from "./group-courses-by-language";
import { router } from "expo-router";
import { ExpoContextMenu } from '@appandflow/expo-context-menu'
import { getApiStudentCoursesKey, useDeleteApiStudentCourse } from "@/server/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { removeStudentCourse, removeStudentCourseKey } from "@/server/remove-student-course";
import { Button } from "@/components/button";
import { getMyCourses, myCoursesKey } from "@/server/get-my-courses";
import { getAvailableCoursesKey } from "@/server/get-available-courses";
import { navigateToAvailableCourses } from "@/lib/navigation";

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

     const queryClient = useQueryClient();
     const { mutateAsync: unsub, isPending } = useMutation({
        mutationFn: removeStudentCourse,
        mutationKey: removeStudentCourseKey,
        onSuccess: async () => {
            await Promise.all([
            queryClient.invalidateQueries({queryKey: myCoursesKey}),
            queryClient.invalidateQueries({queryKey: getAvailableCoursesKey})
            ])
        }
     });

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
                            No courses yet
                        </Text>
                        <Text className="text-white/70 text-center">
                            You're not subscribed to any courses. Browse available courses to get started.
                        </Text>
                        <Button
                            text="Browse courses"
                            onPress={navigateToAvailableCourses}
                        />
                    </View>
                ) : (
                groupCoursesByLanguage(courses).map(group => (
                    <View key={group.language} className="flex flex-col items-stretch gap-4">
                        <Text className="text-white text-2xl font-bold">{group.language}</Text>
                        {group.courses.map(course => (
                            <ExpoContextMenu
                                key={course.id}
                                menuItems={[
                                    {
                                        title: "Unsubcribe",
                                        onPress: () => unsub(course.id),
                                    }
                                ]}
                            >
                                <CourseItem
                                    course={course}
                                    onPress={() => navigateToCourseSummary(course.id)}
                                    progress={course.overallProgress ?? undefined}
                                />
                            </ExpoContextMenu>
                        ))}
                    </View>
                ))
                )}
            </View>
        </ScrollView>
    )
}