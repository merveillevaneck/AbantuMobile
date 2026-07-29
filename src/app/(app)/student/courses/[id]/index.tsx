
import React, { useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";

import { Header, Screen, UnitItem } from "@/components";
import { router, useLocalSearchParams } from "expo-router";
import { useGetApiStudentCourse } from "@/server/api";
import { ExpoContextMenu } from '@appandflow/expo-context-menu';
import { StartSessionButton } from "@/components/start-session-button";

export default function Page() {

  const { id } = useLocalSearchParams<{id: string}>();

  const { data, isPending } = useGetApiStudentCourse({
      id: Number(id),
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
          title="course progress summary"
          className='w-screen'
          onBack={() => router.back()} />
      }
      className="items-center"
      containerClassName="gap-4 relative w-full flex-1"
      contentContainerClassName="flex flex-col px-4 items-center"
    >
        <View className="w-full max-w-[500px] flex flex-col gap-4">
            {data?.units?.map(unit => (
                <UnitItem
                    unit={unit}
                    key={unit.id}
                    progress={unit.progress ?? 0}
                    action={<StartSessionButton className="w-full" unitId={unit.id} courseId={Number(id)} unitType={unit.type} />}
                />
            ))}
        </View>
    </Screen>
  );
}
