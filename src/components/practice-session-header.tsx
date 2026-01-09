import { Header } from "./header"
import { ProgressBar } from "./progress-bar"
import { HapticPressable } from "./haptic-pressable";
import { Ionicons } from "@expo/vector-icons";
import { cn } from "@/tw/util";

type PracticeSessionHeaderProps = {
    title: string;
    progress: number;
    onBack?: () => void;
    className?: string;
}

export const PracticeSessionHeader = (props: PracticeSessionHeaderProps) => {
    const { title, progress, onBack, className } = props;

    return (
        <Header
            title={title}
            backPosition="right"
            className={cn("gap-2 px-2 pb-2 flex-col-reverse", className)}
            backTrigger={
                <HapticPressable
                    onPress={onBack}
                    className="p-1 px-2 bg-green-100 rounded-lg active:bg-green-200 items-center justify-center"
                >
                    <Ionicons name="close" size={18} color="green-900" />
                </HapticPressable>
            }
        >
            <ProgressBar progress={progress} />
        </Header>
    )
}