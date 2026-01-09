
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { api } from "@/server/client";
import { router, useLocalSearchParams } from "expo-router";
import { Header } from "@/components/header";
import { Screen } from "@/components";
import { UnitItem } from "@/components/unit-item";

export default function Page() {

  const { id } = useLocalSearchParams<{id: string}>();

  const { data: course } = api.useQuery(
    'get',
    '/api/courses/{id}',
    {
        params: {
            path: {
                id
            }
        }
    }
  )

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

  if (isPending) return (
    <View className="flex-1 flex flex-col items-center justify-center pt-7">
      <Text>Loading...</Text>
    </View>
  )

  return (
    <Screen
        header={<Header title={course?.name} onBack={() => router.back()} />}
    >
        <ScrollView
            className="flex flex-1"
            contentContainerClassName="flex flex-col items-stretch px-5 gap-2 py-10"
        >
            {data?.map(unit => (
              <UnitItem key={unit.id} unit={unit} />
            ))}
            {!data?.length && (
              <Text>
                No units available
              </Text> 
            )}
        </ScrollView>
    </Screen>
  );
}
