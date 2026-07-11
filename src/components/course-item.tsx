import { ActivityIndicator, Pressable, Text, View } from "react-native"
import { cn } from '@/tw/util';
import { ProgressBar } from "./progress-bar";
import { ResponseOf } from "@/server/api/responses";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { subscribeToCourse, subscribeToCourseKey } from "@/server/subscribe-to-course";
import { Button } from "./button";
import { getAvailableCoursesKey } from "@/server/get-available-courses";
import { myCoursesKey } from "@/server/get-my-courses";


type Courses = ResponseOf<'getApicourses'>
type Course = Courses[number];
export type CourseItemProps = {
    className?: string;
    course: Course;
    onPress?: ((course?: Course) => void) | (() => void)
    progress?: number;
    action?: React.ReactNode;
    subscribeable?: boolean;
    onSubscribe?: () => void;
}

export const CourseItem = (props: CourseItemProps) => {
    const {
        className,
        course,
        onPress: $onPress,
        progress,
        action,
        subscribeable,
    } = props;

    const queryClient = useQueryClient();
    const { mutateAsync: sub, isPending } = useMutation({
        mutationKey: subscribeToCourseKey,
        mutationFn: subscribeToCourse,
        onSuccess: async () => {
            await Promise.all([
                await queryClient.invalidateQueries({queryKey: getAvailableCoursesKey}),
                await queryClient.invalidateQueries({queryKey: myCoursesKey})
            ])
            props.onSubscribe?.();
        }
    })

    const onPress = () => {
        $onPress?.(course);
    }
    return (
        <Pressable
            onPress={onPress}
            className={cn(
                "flex flex-col items-stretch rounded-4xl bg-[#399653] shadow-md p-4 px-8 active:opacity-60",
                className
            )}
        >
            <View className="flex flex-row items-center justify-between mb-8">
                <Text className="text-white text-2xl font-semibold flex-5">{course.name}</Text>
                {!isPending && typeof progress === "number" && (
                    <ProgressBar progress={0.5} className="flex-3" />
                )}
                {!isPending && !progress && subscribeable && !action && (
                    <Button text="Subscribe" onPress={() => sub(course.id)} />
                )}
                {!isPending && !progress && !!action && typeof action !== "string" && (
                    action
                )}
                {isPending && (
                    <ActivityIndicator color="white" size={18} />
                )}
            </View>
            <View className="flex flex-row items-center justify-between gap-4">
                {!!course.description && (
                    <Text className="shrink text-[#BAFFCA] text-md">{course.description}</Text>
                )}
                {!!course.creator && (
                    <Text className="shrink-0 text-[#BAFFCA] text-md">{course.creator?.firstname}</Text>
                )}
            </View>
        </Pressable>
    )
}
