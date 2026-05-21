import { CompletedExercise, usePracticeStore } from "@/store/practice"
import { View, Text } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated"
import { ProgressBar } from "./progress-bar";
import { Button } from "./button";
import { cn } from "@/tw/util";
import { Audio } from "expo-av";
import { useEffect } from "react";

const playComplete = async () => {
    const { sound } = await Audio.Sound.createAsync(require("../complete-tone.mp3"))
    await sound.playAsync();
}

export type PracticeSessionSummaryProps = {
    completed: CompletedExercise[];
    // todo: make the onsubmit accept stats
    onSubmit: () => void;
}

export const PracticeSessionSummary = (props: PracticeSessionSummaryProps) => {
    const { completed, onSubmit } = props;


    const totalComplete = completed.length;

    const totalRight = completed.reduce((prev, curr) => prev + (curr.correct ? 1 : 0), 0)
    const totalWrong = totalComplete - totalRight;

    //todo: submit da stats tingies here

    useEffect(() => {
        playComplete();
    },
    [])


    return (
        <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch'}}>
            <View className="flex flex-1 justify-evenly items-stretch p-10">
                <Text className="text-8xl text-center font-semibold text-white">
                    You did it!
                </Text>
                <View className="flex flex-col items-stretch gap-2">
                    <Text className="text-8xl text-green-100 text-center">
                        {(totalRight / totalComplete * 100).toFixed(0) + "%"}
                    </Text>
                    <ProgressBar progress={totalRight / totalComplete} />
                </View>
                <View className="flex flex-col items-stretch gap-8">
                    <Text className={cn("text-3xl text-red-400 font-bold text-center", totalWrong === 0 ? "text-green-400" : "")}>
                       {totalWrong === 0 ? "No" : ""} wrong answers 
                    </Text>
                    {totalWrong > 0 && (
                        <Text className="text-6xl text-red-300 font-bold text-center">
                            {totalWrong.toFixed(0)}
                        </Text>
                    )}
                </View>
            </View>
            <View className="flex justify-center items-stretch p-10">
                <Button
                    textClassName="text-2xl"
                    text="Back to the course!"
                    onPress={() => onSubmit()}

                />
            </View>
        </Animated.View>
    )
}