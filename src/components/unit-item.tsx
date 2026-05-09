import { Pressable, Text, View } from "react-native"
import { cn } from '@/tw/util';
import { ProgressBar } from "./progress-bar";
import { Tag } from "./tag";
import { Divider } from "./divider";
import { Button } from "./button";
import { apiClient } from "@/server/api/client";

type Unit = Awaited<ReturnType<typeof apiClient.getApicoursesId>>['units'][number];
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
                    "flex flex-col items-stretch rounded-4xl bg-[#399653] shadow-md p-4 px-8 active:opacity-60 relative",
                    className
                )
            }
        >
            <View className="flex flex-row items-center justify-between mb-2">
                <View className="flex flex-2 flex-row items-center gap-2">
                    <Text className="text-white text-2xl font-semibold">{unit.name}</Text>
                    <Tag text={"level " + unit.level} />
                </View>
                {typeof progress === "number" && <ProgressBar progress={progress} className="flex-1" />}
                {typeof progress === "undefined" && (
                    action
                )}
            </View>

            <Text className="text-sm  text-[#BAFFCA] mt-4">
                {unit.description}
            </Text>
        </Pressable>
    )
}
