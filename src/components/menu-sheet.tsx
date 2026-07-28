import BottomSheet from '@gorhom/bottom-sheet';
import { forwardRef, useRef } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cn } from '@/tw/util';
import { useTokenStore } from '@/store/token';
import { navigateToAvailableCourses } from '@/lib/navigation';

type MenuSheetProps = {
    className?: string;
};

type MenuItemProps = {
    icon: React.ComponentProps<typeof Ionicons>['name'];
    label: string;
    onPress: () => void;
    danger?: boolean;
};

const MenuItem = ({ icon, label, onPress, danger }: MenuItemProps) => (
    <Pressable
        onPress={onPress}
        className="flex flex-row items-center gap-4 px-5 py-4 active:opacity-60"
    >
        <Ionicons name={icon} size={22} color={danger ? '#ff6b6b' : '#BAFFCA'} />
        <Text className={cn('text-base font-medium', danger ? 'text-[#ff6b6b]' : 'text-white')}>
            {label}
        </Text>
    </Pressable>
);

export const MenuSheet = forwardRef<BottomSheet, MenuSheetProps>((props, ref) => {
    const { className } = props;
    const internalRef = useRef<BottomSheet>(null);
    const { clear } = useTokenStore();

    const setRef = (instance: BottomSheet | null) => {
        internalRef.current = instance;
        if (typeof ref === 'function') ref(instance);
        else if (ref) ref.current = instance;
    };

    const close = () => internalRef.current?.close();

    const handleBrowseCourses = () => {
        close();
        navigateToAvailableCourses();
    };

    const handleSettings = () => {
        close();
    };

    const handleLogout = () => {
        close();
        clear();
    };

    return (
        <BottomSheet
            ref={setRef}
            index={-1}
            snapPoints={['30%']}
            enablePanDownToClose
            enableDynamicSizing={false}
            enableContentPanningGesture={false}
            enableOverDrag={false}
            backgroundStyle={{
                flex: 1,
                backgroundColor: '#232427',
                shadowColor: '#257560',
                shadowRadius: 3,
                shadowOpacity: 0.3,
            }}
            handleIndicatorStyle={{ backgroundColor: '#BAFFCA' }}
        >
            <View className={cn('flex flex-col lg:self-center lg:w-120 w-full', className)}>
                <MenuItem icon="compass-outline" label="Browse courses" onPress={handleBrowseCourses} />
                <MenuItem icon="settings-outline" label="Settings" onPress={handleSettings} />
                <MenuItem icon="log-out-outline" label="Log out" onPress={handleLogout} danger />
            </View>
        </BottomSheet>
    );
});

MenuSheet.displayName = 'MenuSheet';
