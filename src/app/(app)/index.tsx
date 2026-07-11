import React, { useEffect } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";

import { CourseItem, Header, Screen } from "@/components";
import { useGetApiCourses, useGetApiStudentCourses } from "@/server/api";
import { router } from "expo-router";
import { Button } from "@/components/button";
import { useTokenStore } from "@/store/token";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { MyCoursesDisplay } from "@/components/my-courses-display";
import { useQuery } from "@tanstack/react-query";
import { getMyCourses, myCoursesKey } from "@/server/get-my-courses";

const navigateToAvailableCourses = () => {
  router.push("/courses");
}

const navigateToLogin = () => {
  router.push("/login");
}

export default function Page() {


  const { data, isPending, error } = useQuery({
    queryKey: myCoursesKey,
    queryFn: getMyCourses,
  });

  // const { data, isPending, error } = useGetApiStudentCourses();
  const { clear } = useTokenStore();



  if (isPending) return (
    <Screen
      header={
        <Header
          title="My Courses"
          right={
            <Pressable
              onPress={() => clear()}
              className="transition-transform duration-150 hover:scale-110 active:scale-95"
            >
              <Ionicons name="log-out-outline" size={28} color="white" />
            </Pressable>
          }
        />
      }
      containerClassName="gap-4 pb-10 relative flex justify-center items-center"
    >
      <ActivityIndicator color="green" size={32}  />
      <Text>hello</Text>
    </Screen>
  )

  return (
    <Screen
      header={
        <Header
          title="My Courses"
          right={
            <Pressable
              onPress={() => clear()}
              className="transition-transform duration-150 hover:scale-110 active:scale-95"
            >
              <Ionicons name="log-out-outline" size={28} color="white" />
            </Pressable>
          }
        />
      }
      containerClassName="gap-4 pb-10"
      floating={
        <View className="absolute bottom-20 right-10">
          <Button
            className="p-4 rounded-full"
            text={<FontAwesome name="plus" color="white"  size={24} />}
            onPress={navigateToAvailableCourses}
          />
        </View>
      }
    >
      <MyCoursesDisplay courses={data} />
    </Screen>
  );
}
