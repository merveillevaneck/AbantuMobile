import { Pressable, Text, View } from "react-native"
import { cn } from '@/tw/util';
import { ProgressBar } from "./progress-bar";
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
    actionText?: React.ReactNode;
    progress?: number;
    action?: React.ReactNode;
    onPress?: ((course?: Unit) => void) | (() => void)
    onPressItem?: ((course?: Unit) => void) | (() => void)
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
        <View
            // disabled={!props.onPressItem}
            className={
                cn(
                    "flex flex-row items-stretch gap-4 rounded-4xl bg-[#399653] shadow-md p-4 px-8 relative",
                    className
                )
            }
        >
            <View className="flex flex-2 flex-col justify-start">
                <Text className="text-white text-xs xs:text-base sm:text-xl font-semibold mb-2">{unit.name}</Text>
                <Text className="text-sm text-[#BAFFCA] mt-4">
                    {unit.description}
                </Text>
            </View>

            <View className="flex flex-1 flex-col justify-center gap-4 items-center">
                {typeof progress === "number" && <ProgressBar progress={progress} className="self-stretch mx-4" />}
                {action ?? (!!props.onPress && <Button className="w-full" text={props.actionText ?? "practice"} onPress={onPress} />)}
            </View>

        </View>
    )
}
