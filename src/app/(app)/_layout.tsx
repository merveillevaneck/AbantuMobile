
import { Redirect, router, Slot, Stack } from "expo-router";
import { KeyboardProvider } from "react-native-keyboard-controller";


import { View } from "react-native";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTokenStore } from "@/store/token";
import { useEffect } from "react";

const queryClient = new QueryClient()

export default function Layout() {

  const { token, hydrated } = useTokenStore();

  console.log('token', token)

  if (hydrated && !token) return <Redirect href="/login" />
  return (
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: "232427",
            }
          }}
        >
          <Slot />
        </Stack>
  );
}


