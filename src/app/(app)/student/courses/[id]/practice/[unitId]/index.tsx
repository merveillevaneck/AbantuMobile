import { Screen, PracticeSessionHeader, Pill, HapticStyle } from '@/components';
import { Button } from '@/components/button';
import { Divider } from '@/components/divider';
import { usePracticeStore, type Exercise } from '@/store/practice';
import { ProgressSummary } from '@/components/progress-summary';
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import * as _ from 'lodash';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, LinearTransition, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { apiClient } from '@/server/api/client';
import { usePostApiStudentSessionEnd } from '@/server/api';
import { useQuery } from '@tanstack/react-query';
import LottieView from 'lottie-react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { cn } from '@/tw/util';
import { PracticeSessionSummary } from '@/components/practice-session-summary';
import { ExerciseCommentsSheet } from '@/components/exercise-comments-sheet';
import { Audio } from 'expo-av';
import {  loadSoundBytes, Playable, playAudio, playBuffer, useSoundByte } from '@/hooks/use-soundbyte';

const blobToBase64 = (blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result as string);
        }

        reader.onerror = (error) => reject(error)

        reader.readAsDataURL(blob);
    })
}

export default function Page() {
    const { unitId } = useLocalSearchParams<{id: string, unitId: string}>();

    const [showLoading, setShowLoader] = useState(true);
    const animation = useRef<LottieView>(null);

    const { complete, current, exercises, completed, sessionId, end, setSessionResult, lastSessionResult } = usePracticeStore();

    const [submission, setSubmission] = useState<{correct: boolean, answer: string[], endedAt: string} | null>(null);
    const [sounds, setSounds] = useState<Record<string, Playable>>({});

    const [showAbortDialog, setShowAbortDialog] = useState(false);
    const { mutateAsync: endSession, isPending: isEnding } = usePostApiStudentSessionEnd();

    const allExercises = [...completed, ...(current ? [current] : []), ...exercises];
    const ids = allExercises.flatMap(ex => ex.questionContent as string);

    useQuery({
        queryKey: ["session-audio", sessionId],
        queryFn: async () => {
            if (sessionId == null) return;
            const sounds = await loadSoundBytes(ids as string[]);
            setSounds(sounds);
            setShowLoader(false);
            return sounds;
        },
        enabled: sessionId != null,
        refetchOnWindowFocus: false,
    })

    const playSound = (id: string) => { const b = sounds[id]; if (b) playAudio(b); };

    const { play: playCorrect } = useSoundByte("correct tone", { type: "mp3" });

    const progress = useMemo(() => {
        const total = (completed.length + exercises.length) + (!!current ? 1 : 0)
        const progress = completed.length / total;
        return progress;
    }, [completed, exercises, current])

    const sheet = useRef<BottomSheet>(null);
    const commentsSheet = useRef<BottomSheet>(null);

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
            const endedAt = new Date().toISOString();
            if (!match) {
                setSubmission({correct: false, answer: opts, endedAt});
                return sheet?.current?.expand();
            }
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            void playCorrect();
            setSubmission({correct: true, answer: opts, endedAt})
            return sheet?.current?.expand();
        }
    }

    const abortSession = async () => {
        setShowAbortDialog(false);
        if (sessionId != null) {
            await endSession({ sessionId, answers: [] });
        }
        end();
        router.back();
    };

    const handleFinishSubmit = async () => {
        if (sessionId != null) {
            const res = await endSession({
                sessionId,
                answers: completed.map(c => ({
                    exerciseId: c.id,
                    answer: c.answer,
                    correct: c.correct,
                    startedAt: c.startedAt,
                    endedAt: c.endedAt,
                })),
            });
            setSessionResult(res);
        }
    };

    const finished = useMemo(() => !current && !!completed.length && !exercises.length, [current, completed, exercises]);

    const firstAnswer = current?.answers?.[0]?.text;
    const generatedMessage = Array.isArray(firstAnswer) ? firstAnswer.join(" ") : firstAnswer;
    const incorrectMessageIsGenerated = !current?.incorrectMessage && !!generatedMessage;
    const incorrectMessage = current?.incorrectMessage || generatedMessage;

    useLayoutEffect(() => {
        animation?.current?.reset();
    }, [])


    if (showLoading) return (
        <Screen key={Date.now()}
            containerClassName='flex items-center justify-center]'
            contentContainerClassName='flex flex-1 items-center justify-center'
            >
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
                loop={true}
            />
        </Screen>
    )


    return (
            <View
                // header={!finished ? <PracticeSessionHeader className="md:w-120 md:self-center" progress={!finished ? progress : undefined} onBack={() => router.back()} /> : null}
                // containerClassName='flex-1 justify-center items-center'
                // contentContainerClassName='flex-1 w-full'
                className="bg-[#232427] flex-1 flex items-stretch flex-col lg-200"
            >
                {!finished ? <PracticeSessionHeader className="lg:w-200 md:self-center m-4 p-2" progress={!finished ? progress : undefined} onBack={() => setShowAbortDialog(true)} onComments={() => commentsSheet?.current?.expand()} /> : null}
                <Animated.View
                    style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'center'}}
                    entering={FadeIn}>
                    {finished && !lastSessionResult && (
                        <PracticeSessionSummary completed={completed} isSubmitting={isEnding} onSubmit={handleFinishSubmit} />
                    )}
                    {finished && lastSessionResult && (
                        <ProgressSummary result={lastSessionResult} onDone={() => { end(); router.back(); }} />
                    )}
                    {/* <Text className="text-white">audio file log:</Text> */}
                    {/* {Object.keys(sounds).map(k => (
                        <Text key={k} className="text-white">{k}: {!!sounds[k] ? "present" : ""}</Text>
                    ))} */}
                    {!!current && (
                        <Question key={current.id} exercise={current} onSubmit={answer => handleCheck(answer)} playSound={playSound} />
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
                            shadowColor: '#257560',
                            shadowRadius: 3,
                            shadowOpacity: 0.3
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
                                paddingBottom: 40,
                                paddingTop: 20,
                                paddingHorizontal: 40,
                                gap: 50,
                            }}>
                                <View className="flex flex-1 flex-col lg:self-center lg:w-200 items-stretch">

                            {submission?.correct && (
                                <>
                                    <Text className="text-4xl text-green-300 font-bold ml-2 mb-4">Correct!</Text>
                                    {/* TODO: add correct and incorrect hint text here! */}
                                    {!!current && current?.correctMessage && (
                                        <Text className="text-xl text-green-300 ml-2">{current?.correctMessage}</Text>
                                    )}
                                </>
                            )}
                            {!submission?.correct && (
                                <>
                                    <Text className="text-4xl font-bold text-red-300">Oops!</Text>
                                    {!!current && !!incorrectMessage && (
                                        <Text className="text-xl font-semibold text-green-200 my-4">
                                            {incorrectMessageIsGenerated && (
                                                <Text className="text-gray-400 font-normal">Answer: </Text>
                                            )}
                                            {incorrectMessage}
                                        </Text>
                                    )}
                                </>
                            )}
                            <Button
                                text={submission?.correct ? "Continue" : "Next Exercise"}
                                className={cn("mt-10", !!submission?.correct ? "bg-[#257560]" : "bg-red-400")}
                                textClassName='text-2xl'
                                onPress={async () => {
                                    sheet?.current?.close();
                                    await new Promise(resolve => setTimeout(() => resolve(true), 400));
                                    setSubmission(null);
                                    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    if (submission) complete(submission?.correct, submission?.answer, submission?.endedAt);
                                }}
                            />
                                </View>
                        </BottomSheetView>
                    </BottomSheet>

                )}

                <ExerciseCommentsSheet ref={commentsSheet} exerciseId={current?.id ?? null} />
                <Modal transparent visible={showAbortDialog} animationType="fade" onRequestClose={() => setShowAbortDialog(false)}>
                    <Pressable className="flex-1 bg-black/60 justify-center items-center px-6" onPress={() => setShowAbortDialog(false)}>
                        <Pressable className="bg-[#232427] rounded-2xl p-5 w-full max-w-md gap-4" onPress={e => e.stopPropagation()}>
                            <Text className="text-white text-xl font-bold">End session?</Text>
                            <Text className="text-white/70">
                                If you leave now, your progress in this session will be lost.
                            </Text>
                            <View className="flex flex-row gap-3 mt-2">
                                <Button className="flex-1 bg-transparent border border-[#333435]" text="Cancel" onPress={() => setShowAbortDialog(false)} />
                                <Button className="flex-1 bg-red-500" text="End session" isLoading={isEnding} onPress={abortSession} />
                            </View>
                        </Pressable>
                    </Pressable>
                </Modal>
            </View>
    )
}

type Option = Exercise['options'][number];
type QuestionProps = {
    exercise: Exercise;
    onSubmit: (answer: string[]) => void;
    playSound: (id: string) => void;
}

const Question = (props: QuestionProps) => {
    const { exercise, onSubmit, playSound } = props;


    const [selected, setSelected] =  useState<Option[]>([]);

    const handleUnselect = (opt: Option) => {
        setSelected(s => s.filter(sel => sel.uuid !== opt.uuid))
    }

    const handleSelect = (opt: Option) => {
        setSelected(s => [...s, opt]);
    }


    const [containerWidth, setContainerWidth] = useState(0);
    const [dimensions, setDimensions] = useState<PillDimension[]>([]);

    useSoundByte(exercise.questionContent!, { playOnMount: true });
    // useEffect(() => { playSound(exercise.questionContent); }, [exercise.questionContent]);


    const selectedDims = selected.map(opt => dimensions.find(dim => dim.option.uuid === opt.uuid))
    return (
        <View className="flex-1 flex-col items-stretch lg:self-center lg:w-180 lg:items-stretch p-10 pt-0">
            <Animated.View
                entering={FadeIn}
                className="flex flex-1"
                style={{flex: 1, width: '100%', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'center'}}
            >
                <View className="flex-2 p-5 pt-0 flex flex-col items-stretch">
                    <Text className="text-white text-2xl mb-10">
                        {exercise?.instruction}
                    </Text>
                    <Text className="text-white text-xl">
                        {exercise?.questionContent}
                    </Text>
                </View>
                <Divider className="opacity-30" />
                <View className="flex flex-col items-stretch relative flex-1">
                    <View className="flex flex-1 flex-row justify-center flex-wrap mt-10 gap-2 absolute top-0 left-0 right-0">
                        {exercise.options?.map((opt, idx) => (
                            <Pill
                                textClassName="text-xl opacity-0"
                                key={idx}
                                text={opt.text}
                                className=" bg-gray-700 border-3 border-t-0 border-l-0 border-b-gray-700 border-r-gray-700  rounded-2xl "
                            />
                        ))}
                    </View>
                    <View
                        className="flex flex-row flex-1 justify-center flex-wrap mt-10 gap-2 absolute top-0 left-0 right-0"
                        onLayout={e => setContainerWidth(e.nativeEvent.layout.width)}>
                        {exercise.options?.map((opt, idx) => (
                            <HoverPill
                                containerWidth={containerWidth}
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
                                key={opt.uuid}
                                opt={opt}
                                // playSound={playSound}
                                onSelect={opt => handleSelect(opt)}
                                onUnselect={() => handleUnselect(opt)}
                            />
                        ))}
                    </View>
                </View>
            </Animated.View>
            <View className="items-stretch justify-center pb-4">
                <Button className="w-full" text="Check" textClassName='text-2xl' onPress={() => onSubmit(selected.map(s => s.text))}  />
            </View>
        </View>
    )
}


type PillDimension = {option: Option, x: number, y: number, width: number, idx: number};
type HoverPillProps = {
    opt: Option
    onSelect: (opt: Option) => void;
    onUnselect: () => void;
    onLayout: (width: number, x: number, y: number) => void;
    selected: PillDimension[];
    containerWidth: number;
    playSound?: (id: string) => void;
}
const isOverThreshold = (threshold: number, prev: number, curr: number) => {
    return Math.abs(prev + curr - threshold) < 50
}

const calcOffsets = (threshold: number) => (prev: {offX: number, offY: number}, curr: PillDimension) => {
    const { offX, offY } = prev;

    const isOver = isOverThreshold(threshold, offX, curr.width);

    const nextOffX = isOver ? 0 : curr.width + offX + 10;
    const nextOffY = offY + (isOver ? 47 : 0)

    return {
        offX: nextOffX,
        offY: nextOffY
    }
}

const HoverPill = (props: HoverPillProps) => {
    const { opt, onSelect, onUnselect, selected, containerWidth } = props;
    const { text, uuid } = opt;

    const { play } = useSoundByte(text, {});

    const pillStyle = useAnimatedStyle(() => {
        const widthThreshold = containerWidth - 55
        const topHeightDisplacement = -190;
        const idx = selected.findIndex(s => s.option.uuid === uuid);
        const isSelected = idx !== -1;
        const sliced = selected.slice(0, idx);
        const { offX, offY } = sliced.reduce(calcOffsets(widthThreshold), {offX: 0, offY: 0})
        const item = selected?.at(idx);
        let transformX = offX - (item?.x ?? 0);
        let transformY = topHeightDisplacement - (item?.y ?? 0) + offY;
        return ({
            transform: [{translateY: withTiming(isSelected ? transformY : 0, {duration: 100})},
                {translateX: withTiming(isSelected ? transformX : 0, {duration: 100 })}
            ]
        })
    })

    const onPress = async () => {
        const isSelected = !!selected.find(s => s.option.uuid === uuid);
        if (!isSelected) play()
        if (isSelected)
         return onUnselect()
        onSelect(opt)
    }
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
                onPress={onPress}
                className="shadow-md border-3 border-t-0 border-l-0 border-b-gray-700 border-r-gray-700  rounded-2xl "
            />
        </Animated.View>
    )
}