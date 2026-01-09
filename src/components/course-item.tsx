import { Pressable, Text, View } from "react-native"
import { cn } from '@/tw/util';
import { components, paths } from "@/server/schema";


type Courses = paths['/api/courses']['get']['responses'][200]['content']['application/json'];
type Course = Courses[number];
export type CourseItemProps = {
    className?: string;
    course: Course;
    onPress?: ((course?: Course) => void) | (() => void)
}

export const CourseItem = (props: CourseItemProps) => {
    const {
        className,
        course,
        onPress: $onPress,
    } = props;

    const onPress = () => {
        $onPress?.(course);
    }
    return (
        <Pressable
            onPress={onPress}
            className={
                cn(
                    "flex flex-col items-stretch rounded-md bg-green-100 border border-green-900 shadow-md p-2 active:bg-green-200",
                    className
                )
            }

        >
            <View className="flex flex-row items-center justify-between">
                <View className="flex flex-row gap-2 items-center">
                    <Text className="text-green-900 font-semibold">{course.name}</Text>
                    <LanguageTag language={course.language} />

                </View>
                {!!course.creator && (
                    <Text className="text-green-700 text-xs">{course.creator?.firstname}</Text>
                )}
            </View>
        </Pressable>
    )
}

export const LanguageTag = (props: {language: string}) => {
    return (
        <View className="rounded-full bg-green-900 border border-green-500 px-2">
            <Text className="text-xs text-white">{props.language}</Text>
        </View>
    )
}