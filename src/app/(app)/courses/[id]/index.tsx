import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

import { Header, Screen, UnitItem } from "@/components";
import { useGetApiCourse } from "@/server/api";
import { router, useLocalSearchParams } from "expo-router";

const navigateBack = () => {
    router.back();
}

export default function Page() {

    const { id } = useLocalSearchParams<{id: string}>();

    const { data, isPending } = useGetApiCourse({
      id: Number(id)
    })

  if (isPending) return (
    <Screen
      header={
        <Header
          onBack={() => router.back()}
          title={<View className="bg-slate-100 rounded-full w-16"></View>}
        />
      }
      containerClassName="gap-4 pb-10 relative flex justify-center items-center"
    >
        <ActivityIndicator color="green" size={32} />
    </Screen>
  )

  return (
    <Screen
      header={
        <Header
          //title={data?.name}
          title="Course summary"
          onBack={() => router.back()}
        />
      }
      containerClassName="gap-4 pb-10 relative w-full flex-1"
      contentContainerClassName="flex flex-col gap-4 px-4 items-center"
    >
        <View className="w-full max-w-[500px] flex flex-col gap-4">
            {data?.units?.map(unit => (
                <UnitItem
                    unit={unit}
                    key={unit.id}
                />
            ))}
            <Text className="text-white font-semibold">units go here</Text>
        </View>
    </Screen>
  );
}
