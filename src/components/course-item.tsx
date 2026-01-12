import { Pressable, Text, View } from "react-native"
import { cn } from '@/tw/util';
import { ProgressBar } from "./progress-bar";
import { Tag } from "./tag";
import { ResponseOf } from "@/server/api/responses";


type Courses = ResponseOf<'getApicourses'>
type Course = Courses[number];
export type CourseItemProps = {
    className?: string;
    course: Course;
    onPress?: ((course?: Course) => void) | (() => void)
    progress?: number;
    action?: React.ReactNode;
}

export const CourseItem = (props: CourseItemProps) => {
    const {
        className,
        course,
        onPress: $onPress,
        progress,
        action,
    } = props;

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
                {typeof progress === "number" && (
                    <ProgressBar progress={0.5} className="flex-3" />
                )}
                {!progress && !!action && typeof action !== "string" && (
                    action
                )}
            </View>
            <View className="flex flex-row items-center justify-between">
                <Tag text={course.language} />
                {!!course.creator && (
                    <Text className="text-[#BAFFCA] text-md">{course.creator?.firstname}</Text>
                )}
            </View>
        </Pressable>
    )
}
