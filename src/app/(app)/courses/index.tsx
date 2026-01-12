import { AvailableCoursesDisplay, Header, Screen } from "@/components";
import { MyCoursesDisplay } from "@/components/my-courses-display";
import { useGetApiCourses } from "@/server/api";
import { router } from "expo-router";

export default function Courses() {

    const { data, isPending } = useGetApiCourses();

    return (
        <Screen
            header={<Header title="Available Courses" onBack={() => router.back()} />}
        >
            <AvailableCoursesDisplay
                isLoading={isPending}
                courses={data}
            />
        </Screen>
    )
}