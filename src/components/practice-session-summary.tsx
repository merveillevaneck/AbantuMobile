import { CompletedExercise, usePracticeStore } from "@/store/practice"
import { View, Text, FlatListComponent } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated"
import { ProgressBar } from "./progress-bar";
import { Button } from "./button";
import { cn } from "@/tw/util";
import { Audio } from "expo-av";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { createSoundByteRef } from "@/hooks/use-soundbyte";

const playComplete = async () => {
    const { sound } = await Audio.Sound.createAsync(require("../complete-tone.mp3"))
    await sound.playAsync();
}

export type PracticeSessionSummaryProps = {
    completed: CompletedExercise[];
    isSubmitting?: boolean;
    onSubmit: () => void;
}

export const PracticeSessionSummary = (props: PracticeSessionSummaryProps) => {
    const { completed, isSubmitting, onSubmit } = props;


    const totalComplete = completed.length;

    const totalRight = completed.reduce((prev, curr) => prev + (curr.correct ? 1 : 0), 0)
    const totalWrong = totalComplete - totalRight;

    const totalTimeMs = completed.length > 0
        ? Math.max(...completed.map(c => new Date(c.endedAt).getTime())) -
          Math.min(...completed.map(c => new Date(c.startedAt).getTime()))
        : 0;
    const totalMins = Math.floor(totalTimeMs / 60000);
    const totalSecs = Math.floor((totalTimeMs % 60000) / 1000);
    const timeLabel = `${totalMins}m ${totalSecs.toString().padStart(2, "0")}s`;

    useQuery({
        queryKey: ["complete"],
        queryFn: async () => {
            const sound = await createSoundByteRef("complete tone", { type: "mp3" });
            await sound.playAsync();
            return sound;
        },
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
    })


    return (
        <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch'}}>
            <View className="flex flex-1 justify-evenly items-stretch p-10 gap-8">
                <Text className="text-6xl text-center font-semibold text-white">
                    You did it!
                </Text>
                <View className="flex flex-col items-stretch gap-3">
                    <Text className="text-5xl text-green-100 text-center font-bold">
                        {(totalRight / totalComplete * 100).toFixed(0) + "%"}
                    </Text>
                    <ProgressBar className="self-center w-3/4" progress={totalRight / totalComplete} />
                </View>
                <View className="flex flex-row justify-center gap-8">
                    <View className="flex flex-col items-center gap-1">
                        <Text className="text-4xl text-green-300 font-bold">
                            {totalRight}
                        </Text>
                        <Text className="text-sm text-white/60">correct</Text>
                    </View>
                    <View className="flex flex-col items-center gap-1">
                        <Text className={cn("text-4xl font-bold", totalWrong === 0 ? "text-green-400" : "text-red-300")}>
                            {totalWrong}
                        </Text>
                        <Text className="text-sm text-white/60">wrong</Text>
                    </View>
                    <View className="flex flex-col items-center gap-1">
                        <Text className="text-4xl text-white font-bold">
                            {timeLabel}
                        </Text>
                        <Text className="text-sm text-white/60">time</Text>
                    </View>
                </View>
            </View>
            <View className="flex justify-center items-stretch p-10">
                <Button
                    textClassName="text-2xl"
                    text="Continue"
                    isLoading={isSubmitting}
                    onPress={() => onSubmit()}
                />
            </View>
        </Animated.View>
    )
}