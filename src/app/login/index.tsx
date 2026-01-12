import { Header, Input, Screen } from "@/components";
import { Button } from "@/components/button";
import { usePostApiAuthLogin } from "@/server/api";
import { useTokenStore } from "@/store/token";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Animated, View } from "react-native";
import { useKeyboardAnimation } from "react-native-keyboard-controller";

const navigateToHome = () => router.replace("/")

export default function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { height } = useKeyboardAnimation();

    const { save } = useTokenStore();
    const { mutateAsync: login, isPending } = usePostApiAuthLogin({
        onSuccess: async data => {
            save(data.accessToken);
            console.log(JSON.stringify(data, null, 2))
            navigateToHome();
        }
    });


    const onSubmit = async () => {
        await login({
            email,
            password
        })
    }

    return (
        <Screen
            containerClassName="flex px-5 flex-col items-stretch pb-10"
            header={<Header title="Login" />}
        >
            <View className=" flex flex-1 flex-col gap-4">
                <Input
                    autoCapitalize="none"
                    label="Email"
                    placeholder="E.g. johndoe@someone.com"
                    value={email}
                    onChangeText={setEmail}
                />
                <Input
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>
            <Animated.View style={{transform: [{translateY: height}]}}>
                <Button
                    className="flex justify-center items-center"
                    text="Submit"
                    onPress={onSubmit}
                    isLoading={isPending}
                />
            </Animated.View>
        </Screen>
    )
}