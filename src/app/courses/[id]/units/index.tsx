
import React from "react";
import { Pressable, Text, View } from "react-native";

import { api } from "@/server/client";
import { router, useLocalSearchParams } from "expo-router";
import { Header } from "@/components/header";

export default function Page() {

  const { id } = useLocalSearchParams<{id: string}>();


  const { data, isPending } = api.useQuery(
    'get',
    '/api/courses/{id}/units',
    {
        params: {
            path: {
                id
            }
        }
    }
  )

  console.log('units', data)

  if (isPending) return (
    <View className="flex-1 flex flex-col items-center justify-center pt-7">
      <Text>Loading...</Text>
    </View>
  )
  return (
    <View className="flex-1 flex flex-col items-stretch pt-7 gap-2 px-5">
        <Header />
      {data?.map(unit => (
        <Pressable
            key={unit.id}
            className="bg-white rounded-md p-4 active:bg-green-100"
            onPress={() => router.push(`/units/${unit.id}`)}
        >
          <Text key={unit.id} className="text-green-900 font-semibold">
            {unit.name}
          </Text>
        </Pressable>
      ))}
      {!data?.length && (
        <Text>
          No units available
        </Text> 
      )}
    </View>
  );
}
