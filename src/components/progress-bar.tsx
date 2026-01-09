import { cn } from "@/tw/util";
import { View } from "react-native"

export type ProgressBarProps = {
    /**
     * The progress of the unit, between 0 and 1 (inclusive).
     */
    progress: number;
    className?: string;
}

export const ProgressBar = (props: ProgressBarProps) => {
    const { progress, className } = props;

    return (
        <View className={cn("h-3 flex flex-row border rounded-full overflow-hidden", className)}>
            <View className="h-full rounded-full left-0 top-0 absolute transition-all duration-300" style={{ width: `${progress * 100}%`, backgroundColor: "#b9f8cf" }} />
        </View>
    )
}