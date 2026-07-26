import { Header } from "./header"
import { ProgressBar } from "./progress-bar"
import { HapticPressable, HapticPressableProps, HapticStyle } from "./haptic-pressable";
import { Ionicons } from "@expo/vector-icons";
import { cn } from "@/tw/util";
import { View } from "react-native";
import { FontAwesome6 } from '@expo/vector-icons'

type PracticeSessionHeaderProps = {
    progress?: number;
    onBack?: () => void;
    onComments?: () => void;
    className?: string;
    hapticStyle?: typeof HapticStyle
} & Omit<HapticPressableProps, 'children' | 'className'>;

export const PracticeSessionHeader = (props: PracticeSessionHeaderProps) => {
    const { progress, onBack, onComments, className } = props;

    return ( 
        <View
            className={cn(
                "flex flex-row px-5 items-center bg-[#232427] py-4 gap-16 mt-16 pr-15",
                className,
            )}
        >
            <HapticPressable
                hapticStyle={HapticStyle.Rigid}
                onPress={() => onBack?.()}
                className="p-2 active:opacity-60"
            >
                <FontAwesome6 name="x" color="white" size={24} />
            </HapticPressable>
            {progress !== undefined && <ProgressBar className="flex-1" progress={progress} />}
            {!!onComments && (
                <HapticPressable
                    hapticStyle={HapticStyle.Light}
                    onPress={() => onComments?.()}
                    className="p-2 active:opacity-60"
                >
                    <Ionicons name="chatbubble-outline" color="white" size={24} />
                </HapticPressable>
            )}
        </View>
    )
}