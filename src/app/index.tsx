import React from "react";
import { ScrollView, Text, View } from "react-native";

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
    >
      <ScrollView
        className="flex flex-1"
        contentContainerClassName="flex flex-col items-stretch px-5 gap-2 py-10"
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
    </Screen>
  );
}
