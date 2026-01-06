import "../global.css";
import { Slot } from "expo-router";

import { View } from "react-native";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient()

export default function Layout() {

  return (
    <QueryClientProvider client={queryClient}>
      <View className="flex flex-1 bg-green-400 flex-col items-stretch pt-10">
        <Slot />
      </View>
    </QueryClientProvider>
  );
}


