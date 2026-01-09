import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { api } from "@/server/client";
import { router } from "expo-router";
import { CourseItem } from "@/components/course-item";
import { Header, Screen } from "@/components";

export default function Page() {

  const { data, isPending } = api.useQuery(
    'get',
    '/api/courses',
  )

  if (isPending) return (
    <View className="flex-1 flex flex-col items-center justify-center pt-7">
      <Text>Loading...</Text>
    </View>
  )
  return (
    <Screen
      header={<Header title="Available Courses" />}
      containerClassName="gap-4 pb-10"
    >
      <View className="flex-1 flex">
        <ScrollView
          className="flex flex-1"
          contentContainerClassName="flex flex-col items-stretch gap-2"
        >
          {data?.map(course => (
            <CourseItem
              onPress={() => router.push(`/courses/${course.id}/units`)}
              course={course}
              key={course.id}
            />
          ))}
          {!data?.length && (
            <Text>
              No courses available
            </Text> 
          )}
        </ScrollView>
      </View>
      <Pressable
        onPress={() => router.push('/components')}
        className="bg-green-100 border border-green-900 shadow-md p-2 active:bg-green-200"
      >
        <Text>View Components</Text>
      </Pressable>
    </Screen>
  );
}
