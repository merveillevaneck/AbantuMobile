import { cn } from "@/tw/util";
import { HapticPressable, HapticPressableProps } from './haptic-pressable';
import { Text } from "react-native";

type PillProps = Omit<HapticPressableProps, 'children'> & {
    text: React.ReactNode;
    textClassName?: string;
};

export const Pill = (props: PillProps) => {
    const { className, text, textClassName, ...rest } = props;
    return (
        <HapticPressable
            className={cn(
                "bg-[#257560] active:opacity-60 w-fit border rounded-full px-3 py-1.5",
                className
            )}
            {...rest}
        >
            {typeof text === "string" && (
                <Text className={
                    cn("text-white", textClassName)
                }>
                    {text}
                </Text>
            )}
            {!!text && typeof text !== "string" && (
                text
            )}
        </HapticPressable>
    )
}