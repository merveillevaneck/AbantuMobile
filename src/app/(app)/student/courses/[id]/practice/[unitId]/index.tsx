import { Screen, PracticeSessionHeader, Pill, HapticStyle } from '@/components';
import { Button } from '@/components/button';
import { Divider } from '@/components/divider';
import { usePracticeStore } from '@/store/practice';
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import * as _ from 'lodash';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, LinearTransition, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { apiClient } from '@/server/api/client';
import { useQuery } from '@tanstack/react-query';
import LottieView from 'lottie-react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { cn } from '@/tw/util';
import { PracticeSessionSummary } from '@/components/practice-session-summary';

export default function Page() {
    const { unitId } = useLocalSearchParams<{id: string, unitId: string}>();

    const [showLoading, setShowLoader] = useState(true);
    const animation = useRef<LottieView>(null);

    const { start, complete, current, exercises, completed } = usePracticeStore();

    console.log('current', JSON.stringify(current, null, 2))

    const [submission, setSubmission] = useState<{correct: boolean, answer: string[]} | null>(null);

    useQuery({
        queryKey: ["exercises", unitId],
        queryFn: async () => {
            const result = await apiClient.getApiunitsIdexercises({
                params: {
                    id: Number(unitId),
                }
            })
            start(result);


            return result;
        },
        refetchOnWindowFocus: true,
    })

    const progress = useMemo(() => {
        const total = (completed.length + exercises.length) + (!!current ? 1 : 0)
        const progress = completed.length / total;
        return progress;
    }, [completed, exercises, current])

    const sheet = useRef<BottomSheet>(null);

    const _handleBottomSheetChanges = (idx: number) => {
        console.log('sheet change to', idx);
    }

    const handleCheck = async (opts: string[]) => {
        if (current?.answerType === "bubbles") {
            let match = false;
            current?.answers?.forEach(answer => {
                const bubbles = (answer?.text as string[])
                if (_.isEqual(opts, bubbles)) match = true;
            })
            console.log('match', match)
                if (!match) {
                    console.log('in match')
                    setSubmission({correct: false, answer: opts});
                    return sheet?.current?.expand();
                }
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                //complete(true, opts);
                setSubmission({correct: true, answer: opts})
                return sheet?.current?.expand();
        }
    }

    const finished = useMemo(() => !current && !!completed.length && !exercises.length, [current, completed, exercises]);

    useLayoutEffect(() => {
        animation?.current?.reset();
    }, [])


    if (showLoading) return (
        <Screen key={Date.now()} containerClassName='flex items-center justify-center'>
            <LottieView
                key={Date.now()}
                ref={animation}
                autoPlay
                style={{
                    width: 100,
                    height: 100,
                    backgroundColor: "transparent",
                }}
                source={require('@/animation.json')}
                loop={false}
                onAnimationFinish={() => setShowLoader(false)}
            />
        </Screen>
    )


    return (
            <Screen
                header={!finished ? <PracticeSessionHeader progress={!finished ? progress : undefined} onBack={() => router.back()} /> : null}
                containerClassName='flex-1 justify-center items-stretch'
            >
                <Animated.View className="flex flex-1 flex-col"
                    style={{flex: 1, flexDirection: 'column', alignItems: 'stretch', justifyContent: 'center'}}
                    entering={FadeIn}>
                    {finished && (
                        <PracticeSessionSummary completed={completed} onSubmit={() => router.back()} />
                    )}
                    {!!current && (
                        <Question key={current.id} exercise={current} onSubmit={answer => handleCheck(answer)} />
                    )}
                </Animated.View>
                {!finished && (
                    <BottomSheet
                        backgroundStyle={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            backgroundColor: '#232427',
                            // borderTopColor: 'darkgray',
                            // borderTopWidth: 1,
                            shadowColor: '#333435',
                            shadowRadius: 0.5,
                            shadowOpacity: 1
                        }}
                        handleIndicatorStyle={{backgroundColor: 'transparent'}}
                        // snapPoints={[200]}
                        index={-1}
                        ref={sheet}
                        onChange={_handleBottomSheetChanges}>
                        <BottomSheetView
                            style={{
                                display: 'flex',
                                flex: 1,
                                justifyContent: 'flex-end',
                                flexDirection: 'column',
                                paddingBottom: 60,
                                paddingTop: 20,
                                paddingHorizontal: 20,
                                gap: 30,
                            }}>
                            {submission?.correct && (
                                <>
                                    <Text className="text-4xl text-green-300 font-bold ml-2">Correct!</Text>
                                    {/* TODO: add correct and incorrect hint text here! */}
                                    {!!current && current?.correctMessage && (
                                        <Text className="text-2xl text-green-300">{current?.correctMessage}</Text>
                                    )}
                                </>
                            )}
                            {!submission?.correct && (
                                <>
                                    <Text className="text-4xl font-bold text-red-300">Oops!</Text>
                                    {!!current && current?.incorrectMessage && (
                                        <Text className="text-2xl text-red-400">{current?.incorrectMessage}</Text>
                                    )}
                                </>
                            )}
                            <Button
                                text={submission?.correct ? "Continue" : "Next Exercise"}
                                className={cn(!!submission?.correct ? "bg-[#257560]" : "bg-red-400")}
                                textClassName='text-2xl'
                                onPress={async () => {
                                    sheet?.current?.close();
                                    await new Promise(resolve => setTimeout(() => resolve(true), 400));
                                    setSubmission(null);
                                    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    if (submission) complete(submission?.correct, submission?.answer);
                                }}
                            />
                        </BottomSheetView>
                    </BottomSheet>

                )}
            </Screen>
    )
}

type Exercise = Awaited<ReturnType<typeof apiClient.getApiunitsIdexercises>>[number];
type QuestionProps = {
    exercise: Exercise;
    onSubmit: (answer: string[]) => void;
}

const Question = (props: QuestionProps) => {
    const { exercise, onSubmit } = props;


    const [selected, setSelected] =  useState<string[]>([]);

    const handleUnselect = (opt: string) => {
        setSelected(s => s.filter(sel => sel !== opt))
    }

    const handleSelect = (opt: string) => {
        setSelected(s => [...s, opt]);
    }


    const [dimensions, setDimensions] = useState<PillDimension[]>([]);


    const selectedDims = selected.map(opt => dimensions.find(dim => dim.option === opt))
    return (
        <View className="flex-1 flex-col items-stretch">
            <Animated.View
                entering={FadeIn}
                style={{flex: 1, flexDirection: 'column', alignItems: 'stretch', justifyContent: 'center'}}
            >
                <View className="flex-1 p-5 flex flex-col items-stretch">
                    <Text className="text-white text-4xl mb-10">
                        {exercise?.instruction}
                    </Text>
                    <Text className="text-white text-2xl">
                        {exercise?.questionContent}
                    </Text>
                </View>
                <Divider className="opacity-30" />
                <View className="h-36 relative">
                    <View className="h-36 flex flex-row flex-wrap mt-10 gap-2 absolute top-0 left-0">
                        {exercise.options?.map((opt, idx) => (
                            <Pill
                                textClassName="text-xl opacity-0"
                                key={idx}
                                text={opt}
                                className=" bg-gray-700 border-3 border-t-0 border-l-0 border-b-gray-700 border-r-gray-700  rounded-2xl "
                            />
                        ))}
                    </View>
                    <View className="h-36 flex flex-row flex-wrap mt-10 gap-2 absolute top-0 left-0">
                        {exercise.options?.map((opt, idx) => (
                            <HoverPill
                                onLayout={(width, x, y) => {
                                    const pillDimension = {
                                        idx,
                                        width,
                                        x,
                                        option: opt,
                                        y,
                                    }
                                    dimensions[idx] = pillDimension
                                    setDimensions([...dimensions])
                                }}
                                selected={selectedDims}
                                key={opt}
                                text={opt}
                                onSelect={opt => handleSelect(opt)}
                                onUnselect={() => handleUnselect(opt)}
                            />
                        ))}
                    </View>
                </View>
            </Animated.View>
            <View className="items-stretch justify-center p-5 pb-10">
                <Button text="Check" textClassName='text-2xl' onPress={() => onSubmit(selected)}  />
            </View>
        </View>
    )
}

type PillDimension = {option: string, x: number, y: number, width: number, idx: number};
type HoverPillProps = {
    text: string;
    onSelect: (opt: string) => void;
    onUnselect: () => void;
    onLayout: (width: number, x: number, y: number) => void;
    selected: PillDimension[];
}

const HoverPill = (props: HoverPillProps) => {
    const { text, onSelect, onUnselect, selected } = props;

    const pillStyle = useAnimatedStyle(() => {
        const idx = selected.findIndex(s => s.option === text);
        const isSelected = idx !== -1;
        const sliced = selected.slice(0, idx);
        const totalWidth = sliced.reduce((prev, curr) => prev + curr.width, 0)
        const totalOffset = idx * 10 + totalWidth;
        const item = selected?.at(idx);
        let transformX = totalOffset - (item?.x ?? 0) - (totalWidth > 250 ? (totalOffset) : 0);
        let transformY = -200 + (item?.y ?? 0) * -1 + (totalWidth > 250 ? 43 : 0);
        return ({
            transform: [{translateY: withTiming(isSelected ? transformY : 0, {duration: 100})},
                {translateX: withTiming(isSelected ? transformX : 0, {duration: 100 })}
            ]
        })
    })
    return (
        <Animated.View
            style={pillStyle}
            onLayout={e => {
                if (!e.nativeEvent.layout) return;
                const { width, x, y } = e.nativeEvent.layout;
                props.onLayout(width, x, y);
            }}
        >
            <Pill
                text={text}
                textClassName="text-xl"
                hapticStyle={HapticStyle.Heavy}
                onPress={() => !!selected.find(s => s.option === text) ? onUnselect() : onSelect(text)}
                className="shadow-md border-3 border-t-0 border-l-0 border-b-gray-700 border-r-gray-700  rounded-2xl "
            />
        </Animated.View>
    )
}