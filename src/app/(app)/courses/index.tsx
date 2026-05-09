import { AvailableCoursesDisplay, Header, Screen } from "@/components";
import { getAvailableCourses, getAvailableCoursesKey } from "@/server/get-available-courses";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";

export default function Courses() {

    const { data, isPending, error } = useQuery({
        queryKey: getAvailableCoursesKey,
        queryFn: getAvailableCourses,
        refetchOnWindowFocus: true
    });

    console.log('error', error)
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