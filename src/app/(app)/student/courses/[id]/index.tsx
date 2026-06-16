
import React, { useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";

import { Header, Screen, UnitItem } from "@/components";
import { router, useLocalSearchParams } from "expo-router";
import { useGetApiStudentCourse } from "@/server/api";
import { ExpoContextMenu } from '@appandflow/expo-context-menu';
import { getUnitExercises } from "@/server/get-unit-exercises";
import { useMutation } from "@tanstack/react-query";
import { usePracticeStore } from "@/store/practice";

const navigateToPracticeSession = (courseId: number, unitId: number) => router.push(`/student/courses/${courseId}/practice/${unitId}`)


export default function Page() {

  const { id } = useLocalSearchParams<{id: string}>();

  const { data, isPending } = useGetApiStudentCourse({
      id: Number(id),
  })

  const handlePractice = async (unit: (typeof data.units)[number]) => {
    navigateToPracticeSession(Number(id), unit.id);
  }

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
      containerClassName="gap-4 relative w-full"
      contentContainerClassName="lg:w-[800px] self-center gap-4"
    >
        {data?.units?.map(unit => (
            <UnitItem
                unit={unit}
                key={unit.id}
                progress={0.5}
                onPress={() => handlePractice(unit)}
            />
        ))}
    </Screen>
  );
}
