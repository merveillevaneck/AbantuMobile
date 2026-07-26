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
                className="flex-1"
                onPress={() => KeyboardController.dismiss()}
            >
                <View className="flex-1 px-6 pt-24 flex flex-col">
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
                </View>

                <View className="px-6 pb-10">
                    <Button
                        className="flex justify-center items-center"
                        text="Log in"
                        onPress={onSubmit}
                        isLoading={isPending}
                    />
                </View>
            </Pressable>
        </KeyboardAvoidingView>
    );
}
