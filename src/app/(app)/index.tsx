import React, { useEffect } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";

import { CourseItem, Header, Screen } from "@/components";
import { useGetApiCourses, useGetApiStudentCourses } from "@/server/api";
import { router } from "expo-router";
import { Button } from "@/components/button";
import { useTokenStore } from "@/store/token";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { MyCoursesDisplay } from "@/components/my-courses-display";

const navigateToAvailableCourses = () => {
  router.push("/courses");
}

const navigateToLogin = () => {
  router.push("/login");
}

export default function Page() {


  const { data, isPending, error } = useGetApiStudentCourses();
  const { clear } = useTokenStore();

  console.log('error', JSON.stringify(error, null, 2))

  if (isPending) return (
    <Screen
      header={
        <Header
          title="My Courses"
          right={<AntDesign onPress={() => clear()} name="logout" size={24} color="white" />}
        />
      }
      containerClassName="gap-4 pb-10 relative flex justify-center items-center"
    >
      <ActivityIndicator color="green" size={32}  />
    </Screen>
  )

  return (
    <Screen
      header={
        <Header
          title="My Courses"
          right={<AntDesign onPress={() => clear()} name="logout" size={24} color="white" />}
        />
      }
      containerClassName="gap-4 pb-10 relative"
    >
      <MyCoursesDisplay courses={data} />
      <View className="absolute bottom-20 right-10">
        <Button
          className="p-4 rounded-full"
          text={<FontAwesome name="plus" color="white"  size={24} />}
          onPress={navigateToAvailableCourses}
        />
      </View>
    </Screen>
  );
}
