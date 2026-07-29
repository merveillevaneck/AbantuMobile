import { Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Button } from "./button";
import { SessionResult } from "@/store/practice";

export type ProgressSummaryProps = {
  result: SessionResult;
  onDone: () => void;
};

export const ProgressSummary = (props: ProgressSummaryProps) => {
  const { result, onDone } = props;
  return (
    <Animated.View
      entering={FadeIn}
      style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch'}}
    >
      <View className="flex flex-1 justify-evenly items-stretch p-10 gap-8">
        <Text className="text-6xl text-center font-semibold text-white">
          Progress
        </Text>
        <Text className="text-white text-center">newProgress: {result.newProgress}</Text>
        <Text className="text-white text-center">hasPreviousSession: {String(result.hasPreviousSession)}</Text>
        <Text className="text-white text-center">mistakesDiff: {result.mistakesDiff}</Text>
        <Text className="text-white text-center">correctDiff: {result.correctDiff}</Text>
        <Text className="text-white text-center">timeDiff: {result.timeDiff}</Text>
      </View>
      <View className="flex justify-center items-stretch p-10">
        <Button
          textClassName="text-2xl"
          text="Back to the course!"
          onPress={onDone}
        />
      </View>
    </Animated.View>
  );
};
