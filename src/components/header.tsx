import { cn } from "@/tw/util";
import { FontAwesome6 } from "@expo/vector-icons";
import { Pressable, Text } from "react-native"
import { View } from "react-native"

type HeaderProps = {
    className?: string;
    title?: React.ReactNode;
    onBack?: () => void;
    children?: React.ReactNode;
    right?: React.ReactNode;
}
export const Header = (props: HeaderProps) => {
    const { className, title, onBack, children, right } = props;
    return (
        <View
            className={cn(
                "flex flex-row items-stretch shadow-lg bg-[#399653] pt-16 px-4",
                className,
            )}
        >
            <View className={cn(
                "flex flex-row flex-1 items-center gap-4",
            )}>
                    {onBack && (<Pressable 
                        className="rounded-tr-md active:opacity-60 flex items-center justify-center w-12"
                        onPress={onBack}
                    >
                        <Text className="text-green-100">
                            <FontAwesome6 name="chevron-left" color="white" size={24} />
                        </Text>
                    </Pressable>)}
                <View className="flex flex-row flex-1 items-center h-12">
                    {!!title && typeof title === "string" &&
                        <Text className="text-white font-semibold text-xl">
                            {title}
                        </Text>
                    }
                    {!!title && typeof title !== "string" && title}
                </View>
                {!!right && (
                    <View className="flex items-center justify-center w-12">
                        {right}
                    </View>
                )}
            </View>
            {children}
        </View>
    )
}