import { Input } from "@/components";
import { Button } from "@/components/button";
import { usePostApiAuthLogin } from "@/server/api";
import { useTokenStore } from "@/store/token";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import {
    KeyboardAvoidingView,
    KeyboardController,
} from "react-native-keyboard-controller";

const navigateToHome = () => router.replace("/");

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { save } = useTokenStore();
    const { mutateAsync: login, isPending } = usePostApiAuthLogin({
        onSuccess: async (data) => {
            save(data.accessToken);
            navigateToHome();
        },
    });

    const onSubmit = async () => {
        KeyboardController.dismiss();
        await login({ email, password });
    };

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-[#232427]"
            behavior="padding"
            keyboardVerticalOffset={0}
        >
            <Pressable
                className="flex-1 items-center"
                onPress={() => KeyboardController.dismiss()}
            >
                <View className="flex-1 w-full max-w-sm px-6 flex flex-col justify-center py-10">
                    <View className="flex flex-col gap-2 mb-12">
                        <Text className="text-[#BAFFCA] text-4xl font-bold">
                            Abantu
                        </Text>
                        <Text className="text-white/60 text-base">
                            Welcome back. Log in to keep learning.
                        </Text>
                    </View>

                    <View className="flex flex-col gap-5">
                        <Input
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType="email-address"
                            label="Email"
                            placeholder="johndoe@someone.com"
                            value={email}
                            onChangeText={setEmail}
                            returnKeyType="next"
                            onSubmitEditing={() => KeyboardController.setFocusTo("next")}
                        />
                        <Input
                            label="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            returnKeyType="go"
                            onSubmitEditing={onSubmit}
                        />
                    </View>

                    <View className="mt-8">
                        <Button
                            className="flex justify-center items-center"
                            text="Log in"
                            onPress={onSubmit}
                            isLoading={isPending}
                        />
                    </View>
                </View>
            </Pressable>
        </KeyboardAvoidingView>
    );
}
