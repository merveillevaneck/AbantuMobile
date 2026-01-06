import { router } from "expo-router"
import { Pressable, Text } from "react-native"
import { View } from "react-native"

export const Header = () => {
    return (
        <View className="px-5 flex flex-row items-center h-16 border-b border-b-green-900 shadow-md bg-green-700">
            <Pressable onPress={() => router.back()}>
                <Text className="text-green-100">BACK</Text>
            </Pressable>
        </View>
    )
}