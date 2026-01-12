import { Text, View } from "react-native"

export const Tag = (props: {text: string}) => {
    return (
        <View className="rounded-full bg-[#257560] px-2 py-1 shadow-md">
            <Text className="text-xs text-white">{props.text}</Text>
        </View>
    )
}