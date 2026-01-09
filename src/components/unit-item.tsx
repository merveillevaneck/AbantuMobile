import { Pressable, Text, View } from "react-native"
import { cn } from '@/tw/util';
import { components, paths } from "@/server/schema";


type Unit = paths['/api/units/{id}']['get']['responses'][200]['content']['application/json'];
export type UnitItemProps = {
    className?: string;
    unit: Unit;
    onPress?: ((course?: Unit) => void) | (() => void)
}

export const UnitItem = (props: UnitItemProps) => {
    const {
        className,
        unit,
        onPress: $onPress,
    } = props;

    const onPress = () => {
        $onPress?.(unit);
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
                    <Text className="text-green-900 font-semibold">{unit.name}</Text>
                    <Tag text={"level " + unit.level} />

                </View>
            </View>
            <View className="my-2 h-1 border-b border-green-900"></View>
            <Text className="text-xs text-green-900">
                {unit.description}
            </Text>
        </Pressable>
    )
}

export const Tag = (props: {text: string}) => {
    return (
        <View className="rounded-full bg-green-900 border border-green-500 px-2">
            <Text className="text-xs text-white">{props.text}</Text>
        </View>
    )
}