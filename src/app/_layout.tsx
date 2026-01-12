import "../global.css";
import { KeyboardProvider } from "react-native-keyboard-controller";


import { View } from "react-native";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot } from "expo-router";

const queryClient = new QueryClient()

export default function Layout(props: {children: React.ReactNode}) {

  return (
    <KeyboardProvider>
      <QueryClientProvider client={queryClient}>
        <View className="flex flex-1 flex-col items-stretch">
          <Slot />
        </View>
      </QueryClientProvider>
    </KeyboardProvider>
  );
}


