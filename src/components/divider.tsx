import { cn } from "@/tw/util";
import { View } from "react-native";

export type DividerProps = {
    className?: string;
}

export const Divider = (props: DividerProps) => {
    const { className } = props;
    return (
        <View className={cn(
            "h-1 rounded-full bg-[#BAFFCA]",
            className
        )} />
    );
}