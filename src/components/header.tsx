import { cn } from "@/tw/util";
import { Pressable, Text } from "react-native"
import { View } from "react-native"

type HeaderProps = {
    className?: string;
    title?: React.ReactNode;
    onBack?: () => void;
    backPosition?: "left" | "right";
    backTrigger?: React.ReactNode;
    children?: React.ReactNode;
}
export const Header = (props: HeaderProps) => {
    const { className, title, onBack, backPosition = "left", backTrigger, children } = props;
    return (
        <View
            className={cn(
                "flex border-b border-b-green-900 shadow-md bg-green-900 pt-16 px-4",
                className,
            )}
        >
            <View className={cn(
                "flex flex-row items-center gap-4",
                backPosition === "right" && "flex-row-reverse justify-between",
            )}>
                {backTrigger ? (
                    backTrigger
                ) : (
                    <Pressable 
                        className="rounded-tr-md active:bg-green-700 flex items-center justify-center"
                        onPress={onBack}
                    >
                        <Text className="text-green-100">
                            {backTrigger ?? "BACK"}
                        </Text>
                    </Pressable>
                )}
                <View className="flex flex-row items-center h-12">
                    {!!title && typeof title === "string" &&
                        <Text className="text-green-500 font-semibold text-xl">
                            {title}
                        </Text>
                    }
                    {!!title && typeof title !== "string" && title}
                </View>
            </View>
            {children}
        </View>
    )
}