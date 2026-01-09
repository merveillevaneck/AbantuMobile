import { cn } from "@/tw/util";
import { HapticPressable, HapticPressableProps } from './haptic-pressable';

type PillProps = HapticPressableProps;

export const Pill = (props: PillProps) => {
    const { className, children, ...rest } = props;
    return (
        <HapticPressable
            className={cn("bg-green-200 active:bg-green-300 w-fit border rounded-full px-3 py-1.5", className)}
            {...rest}
        >
            {children}
        </HapticPressable>
    )
}