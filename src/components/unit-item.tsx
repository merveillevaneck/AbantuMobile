import { Pressable, Text, View } from "react-native"
import { cn } from '@/tw/util';
import { components, paths } from "@/server/schema";
import { ProgressBar } from "./progress-bar";
import { Tag } from "./tag";
import { Divider } from "./divider";


type Unit = paths['/api/units/{id}']['get']['responses'][200]['content']['application/json'];
export type UnitItemProps = {
    className?: string;
    unit: Unit;
    /**
     * The progress of the unit, between 0 and 1. If provided, the progress bar will be displayed.
     */
    progress?: number;
    action?: React.ReactNode;
    onPress?: ((course?: Unit) => void) | (() => void)
}

export const UnitItem = (props: UnitItemProps) => {
    const {
        className,
        unit,
        onPress: $onPress,
        progress,
        action,
    } = props;

    const onPress = () => {
        $onPress?.(unit);
    }
    return (
        <Pressable
            onPress={onPress}
            className={
                cn(
                    "flex flex-col items-stretch rounded-4xl bg-[#399653] shadow-md p-4 px-8 active:opacity-60",
                    className
                )
            }
        >
            <View className="flex flex-row items-center justify-between mb-2">
                <Text className="text-white text-2xl font-semibold flex-5">{unit.name}</Text>
                {typeof progress === "number" && <ProgressBar progress={progress} className="flex-3" />}
                {typeof progress === "undefined" && (
                    action
                )}
            </View>
            <View className="flex flex-row items-center justify-between">
                <Tag text={"level " + unit.level} />
            </View>

            <Text className="text-xs text-[#BAFFCA] mt-4">
                {unit.description}
            </Text>
        </Pressable>
    )
}
