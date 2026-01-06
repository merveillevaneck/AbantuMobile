import React from "react";
import { Pressable, Text, View } from "react-native";

import { api } from "@/server/client";
import { router } from "expo-router";

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
    <View className="flex-1 flex flex-col items-stretch pt-7 gap-2 px-5">
      {data?.map(courses => (
        <Pressable key={courses.id} onPress={() => router.push(`/courses/${courses.id}/units`)} className="bg-white rounded-md p-4 active:bg-green-100">
          <Text className="text-green-900 font-semibold">
            {courses.name}
          </Text>
        </Pressable>
      ))}
      {!data?.length && (
        <Text>
          No courses available
        </Text> 
      )}
    </View>
  );
}
