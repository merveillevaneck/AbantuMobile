import { cn } from "@/tw/util";
import { router } from "expo-router"
import { Pressable, Text } from "react-native"
import { View } from "react-native"

type HeaderProps = {
    className?: string;
    title?: React.ReactNode;
    onBack?: () => void;
}
export const Header = (props: HeaderProps) => {
    const { className, title, onBack } = props;
    return (
        <View className={cn(
            "flex flex-row items-stretch border-b border-b-green-900 shadow-md bg-green-900 pt-16",
            className,
        )}>
            {onBack && (
                <Pressable 
                    className="px-5 py-2 rounded-r-md active:bg-green-700 flex items-center justify-center"
                    onPress={() => router.back()}
                >
                    <Text className="text-green-100">BACK</Text>
                </Pressable>
            )}
            <View className="flex flex-row items-center h-12 pl-5">
                {!!title && typeof title === "string" && <Text className="text-green-500 font-semibold text-xl">
                    {title}
                </Text>}
                {!!title && typeof title !== "string" && title}
            </View>
        </View>
    )
}