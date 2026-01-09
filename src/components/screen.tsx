import { cn } from "@/tw/util";
import { View } from "react-native";

type ScreenProps = {
    header?: React.ReactNode;
    className?: string;
    containerClassName?: string;
    children?: React.ReactNode;
}

export const Screen = (props: ScreenProps) => {
    const { 
        header,
        className,
        containerClassName,
    } = props;

    return (
        <View
            className={cn(
                "flex-1 flex flex-col items-stretch gap-2",
                !header ? "pt-16" : "",
                className
            )}
        >
            {!!header && header}
            <View
                className={cn(
                    "flex flex-1 items-stretch flex-col",
                    containerClassName
                )}
            >
                {props.children}
            </View>
        </View>
    )
}