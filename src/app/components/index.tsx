import { CourseItem, Header, Pill, PracticeSessionHeader, Screen, UnitItem } from "@/components";
import { router } from "expo-router";
import { Text, View } from "react-native";

export default function Components() {
    return (
        <Screen
            header={<Header title="Components" onBack={() => router.back()} />}
            containerClassName="gap-4"
        >
            <Text className="text-xl font-semibold">Pill</Text>
            <View className="flex flex-row gap-2">
                <Pill>
                    <Text>Hello</Text>
                </Pill>
                <Pill>
                    <Text>There</Text>
                </Pill>
            </View>
            <Text className="text-xl font-semibold">Unit Item</Text>
            <UnitItem
                unit={{
                    id: 1,
                    name: "Unit 1",
                    description: "Unit 1 description",
                    level: 1,
                    creatorId: 1,
                }}
            />
            <Text className="text-xl font-semibold">Unit Item with Progress</Text>
            <UnitItem
                progress={0.3}
                unit={{
                    id: 2,
                    name: "Unit 2",
                    description: "Unit 2 description",
                    level: 2,
                    creatorId: 2,
                }}
            />
            <Text className="text-xl font-semibold">Course Item</Text>
            <CourseItem
                course={{
                    id: 1,
                    name: "Course 1",
                    language: "English",
                    status: undefined,
                    units: [],
                    creator: undefined,
                }}
            />
            <Text className="text-xl font-semibold">Practice Session Header</Text>
            <PracticeSessionHeader
                progress={0.5}
                title="Unit 1"
                className="rounded-t-[50px]"
                onBack={() => console.log("back")}
            />
        </Screen>
    )
}
