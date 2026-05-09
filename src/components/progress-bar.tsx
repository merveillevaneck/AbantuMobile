import { cn } from "@/tw/util";
import { useState } from "react";
import { View } from "react-native"
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";

export type ProgressBarProps = {
    /**
     * The progress of the unit, between 0 and 1 (inclusive).
     */
    progress: number;
    className?: string;
}

export const ProgressBar = (props: ProgressBarProps) => {
    const { progress, className } = props;

    const [total, setTotal] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);

    const style = useAnimatedStyle(() => {
        const width = progress * total;
        return {
            backgroundColor: "#BAFFCA",
            width: withTiming(width, {duration: 300}),
            borderRadius: height / 2
        }
    })

    return (
        <View
            onLayout={e => {
                setTotal(e.nativeEvent.layout.width)
                setHeight(e.nativeEvent.layout.height)
            }}
            className={cn("h-3 flex flex-row rounded-full overflow-hidden bg-[#257560]", className)}>
            <Animated.View
                className="h-full rounded-full left-0 top-0 absolute transition-all duration-300"
                style={style}
            />
        </View>
    )
}