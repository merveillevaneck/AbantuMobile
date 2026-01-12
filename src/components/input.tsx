import { cn } from "@/tw/util";
import { Text, TextInput, TextInputProps, View } from "react-native";

export type InputProps = {
    containerClassName?: string;
    labelClassName?: string;
    label?: string;
} & Omit<TextInputProps , ''>;

export const Input = (props: InputProps) => {
    const {
        value,
        onChangeText,
        className,
        containerClassName,
        labelClassName,
        label,
        ...rest
    } = props;

    return (
        <View
            className={cn(
                "flex flex-col gap-2",
            )}
        >
            {!!label && (
                <Text
                    className={cn(
                        "text-[#BAFFCA]",
                        labelClassName
                    )}
                >
                    {label}
                </Text>
            )}
            <TextInput
                className={cn(
                    "border border-[#257560] text-[#BAFFCA] px-4 py-2 rounded-lg",
                )}
                placeholderTextColor="#BAFFCA"
                value={value}
                onChangeText={onChangeText}
                {...rest}
            />
        </View>
    )
}