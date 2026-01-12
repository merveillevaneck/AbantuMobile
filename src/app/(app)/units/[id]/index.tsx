import { PracticeSessionHeader, Screen } from "@/components";
import { Header } from "@/components/header";
//import { api } from "@/server/client";
import { paths } from "@/server/schema";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

//type Exercise = paths['/api/units/{id}/exercises']['get']['responses'][200]['content']['application/json'][number];

export default function Page() {

    const { id } = useLocalSearchParams<{id: string}>();
    // const { data: unit, } = api.useQuery(
    //     'get',
    //     '/api/units/{id}',
    //     {
    //         params: { path: { id: Number(id) }}
    //     }
    // )
    // const { data, isPending } = api.useQuery(
    //     'get',
    //     '/api/units/{id}/exercises',
    //     {
    //         params: {
    //             path: {
    //                 id: Number(id),
    //             }
    //         }
    //     }
    // )

    //const [exercise, setExercise] = useState<Exercise | null>(null);

    // useEffect(() => {
    //     if (data?.[0]) {
    //         setExercise(data[0]);
    //     } 
    // }, [data])

    // if (isPending && !exercise) {
    //     return (
    //         <View className="flex-1 pt-10 pb-5 flex flex-col items-center justify-center gap-2">
    //             <Text className="text-green-900">Loading...</Text>
    //         </View>
    //     )
    // }

    return (
        <Screen header={<PracticeSessionHeader progress={0.5} onBack={() => router.back()} />} >
            {/* <Text className="text-green-900 font-semibold">{exercise?.question}</Text> */}
        </Screen>
    )
}