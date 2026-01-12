
import React, { useEffect } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";

import { CourseItem, Header, Screen, UnitItem } from "@/components";
import { useGetApiCourses, useGetApiStudentCourses } from "@/server/api";
import { router, useLocalSearchParams } from "expo-router";
import { Button } from "@/components/button";
import { useTokenStore } from "@/store/token";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { MyCoursesDisplay } from "@/components/my-courses-display";
import { useGetApiStudentCourse } from "@/server/api";

const navigateBack = () => {
    router.back();
}

export default function Page() {

    const { id } = useLocalSearchParams<{id: string}>();

    const { data, isPending, error } = useGetApiStudentCourse({
        id: Number(id),
    })

    console.log("error", error)

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
          title="course progress summary"
          onBack={() => router.back()}
        />
      }
      containerClassName="gap-4 pb-10 relative"
    >
        {data?.units?.map(unit => (
            <UnitItem
                unit={unit}
                key={unit.id}
                progress={0.5}
            />
        ))}
    </Screen>
  );
}
