import { ComponentProps } from "react";
import { Pressable } from "react-native";
import * as Haptics from 'expo-haptics';

export const HapticStyle = Haptics.ImpactFeedbackStyle;

export type HapticPressableProps = ComponentProps<typeof Pressable> & {
    hapticEnabled?: boolean;
    hapticStyle?: Haptics.ImpactFeedbackStyle;
};

export const HapticPressable = (props: HapticPressableProps) => {
    const { children, hapticEnabled = true, hapticStyle = Haptics.ImpactFeedbackStyle.Soft, ...rest } = props;
    return (
        <Pressable
            onPressIn={() => {
                if (hapticEnabled) {
                    Haptics.impactAsync(hapticStyle);
                }
            }}
            {...rest}
        >
            {children}
        </Pressable>
    )
}