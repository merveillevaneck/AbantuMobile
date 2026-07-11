
import { cn } from '@/tw/util';
import { ActivityIndicator, Pressable, Text, type PressableProps } from 'react-native';
import { HapticPressable, HapticPressableProps } from './haptic-pressable';

export type ButtonProps = {
    text: React.ReactNode;
    className?: string;
    textClassName?: string;
    isLoading?: boolean;
} & Omit<HapticPressableProps, 'children' | 'className'>;

export const Button = (props: ButtonProps) => {
    const { text, className, textClassName, isLoading, ...rest } = props;
    return (
        <HapticPressable
            className={cn(
                "bg-[#257560] rounded-2xl p-3 px-4 shadow-md active:opacity-60 flex flex-row justify-center items-center",
                className,
            )}
            {...rest}
        >
            {!isLoading && typeof text === "string" && (
                <Text
                    className={cn(
                        "text-white font-semibold text-[10px] xs:text-xs sm:text-sm",
                        textClassName,
                    )}
                >
                    {text}
                </Text>
            )}
            {!isLoading && !!text && typeof text !== "string" && (
                text
            )}
            {isLoading && (
                <ActivityIndicator className="text-green-200" />
            )}
        </HapticPressable>
    )
}