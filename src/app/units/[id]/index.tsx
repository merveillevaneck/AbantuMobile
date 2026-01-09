import { Screen } from "@/components";
import { Header } from "@/components/header";
import { api } from "@/server/client";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Page() {

    const { id } = useLocalSearchParams<{id: string}>();
    const { data: unit, } = api.useQuery(
        'get',
        '/api/units/{id}',
        {
            params: { path: { id }}
        }
    )
    const { data, isPending } = api.useQuery(
        'get',
        '/api/units/{id}/exercises',
        {
            params: {
                path: {
                    id,
                }
            }
        }
    )

    if (isPending) {
        return (
            <View className="flex-1 pt-10 pb-5 flex flex-col items-center justify-center gap-2">
                <Text className="text-green-900">Loading...</Text>
            </View>
        )
    }
    return (
        <Screen header={<Header onBack={() => router.back()} title={unit.name} />} >
            {data?.map(exercise => (
                <Pressable
                    key={exercise.id}
                    className="bg-white rounded-md p-4 active:bg-green-100"
                >
                  <Text className="text-green-900 font-semibold">
                    {exercise.question}
                  </Text>
                </Pressable>
            ))}
        </Screen>
    )
}