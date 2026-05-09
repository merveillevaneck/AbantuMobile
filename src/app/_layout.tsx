import "../global.css";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { ExpoContextMenuProvider } from '@appandflow/expo-context-menu';


import { View } from "react-native";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot } from "expo-router";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const queryClient = new QueryClient()

export default function Layout(props: {children: React.ReactNode}) {

  return (
    <KeyboardProvider>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView className="flex flex-1 bg-transparent">
          <ExpoContextMenuProvider>
            <View className="flex flex-1 flex-col items-stretch bg-[#232427]">
              <Slot />
            </View>
          </ExpoContextMenuProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </KeyboardProvider>
  );
}


