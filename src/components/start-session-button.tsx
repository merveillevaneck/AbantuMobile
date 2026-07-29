import { router } from "expo-router";
import { Button } from "./button";
import { useStartSession } from "@/hooks/use-start-session";

export type StartSessionButtonProps = {
  unitId: number;
  courseId: number;
  unitType: "lesson" | "practice";
  className?: string;
  textClassName?: string;
};

export const StartSessionButton = (props: StartSessionButtonProps) => {
  const { unitId, courseId, unitType, className, textClassName } = props;
  const { startSession, isPending } = useStartSession();

  const handlePress = async () => {
    await startSession({ unitId });
    router.push(`/student/courses/${courseId}/practice/${unitId}`);
  };

  return (
    <Button
      className={className}
      textClassName={textClassName}
      text={unitType === "lesson" ? "learn" : "practice"}
      isLoading={isPending}
      onPress={handlePress}
    />
  );
};
