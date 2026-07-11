import { Pressable, Text, View } from "react-native"
import { cn } from '@/tw/util';
import { ProgressBar } from "./progress-bar";
import { ResponseOf } from "@/server/api/responses";
import { Button } from "./button";


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
        subscribeable,
    } = props;

    const onPress = () => {
        $onPress?.(course);
    }
    return (
        <View
            className={cn(
                "flex flex-row items-stretch gap-4 rounded-4xl bg-[#399653] shadow-md p-4 px-8 relative",
                className
            )}
        >
            <View className="flex flex-2 flex-col justify-start">
                <Text className="shrink text-white text-xs xs:text-base sm:text-xl font-semibold">{course.name}</Text>
                {!!course.description && (
                    <Text className="text-sm text-[#BAFFCA] mt-4">{course.description}</Text>
                )}
                {!!course.creator && (
                    <Text className="text-xs text-[#BAFFCA] mt-2">{course.creator?.firstname}</Text>
                )}
            </View>

            <View className="flex flex-1 flex-col justify-center gap-4 items-center">
                {typeof progress === "number" && <ProgressBar progress={progress} className="self-stretch mx-4" />}
                <Button className="w-full" text={subscribeable ? "overview" : "view progress"} onPress={onPress} />
            </View>
        </View>
    )
}
