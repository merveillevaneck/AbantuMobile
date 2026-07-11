import { cn } from "@/tw/util";
import { ScrollView, View } from "react-native";

type ScreenProps = {
    header?: React.ReactNode;
    className?: string;
    containerClassName?: string;
    contentContainerClassName?: string;
    children?: React.ReactNode;
    floating?: React.ReactNode;
}

export const Screen = (props: ScreenProps) => {
    const {
        header,
        className,
        containerClassName,
        contentContainerClassName,
        children,
        floating,
    } = props;

    return (
        <View
            className={cn(
                "flex-1 flex flex-col items-stretch bg-[#232427]",
                !header ? "pt-16" : "",
                className
            )}
        >
            {header}
            <ScrollView
                className={cn(
                    "flex-1",
                    containerClassName
                )}
                contentContainerClassName={cn(
                    "pt-10 pb-20",
                   contentContainerClassName 
                )}
            >
                {children}
            </ScrollView>
            {floating}
        </View>
    )
}