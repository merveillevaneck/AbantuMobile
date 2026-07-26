import BottomSheet from '@gorhom/bottom-sheet';
import { forwardRef, useMemo, useState } from 'react';
import { Animated, FlatList, Modal, Pressable, Text, View } from 'react-native';
import { useKeyboardAnimation } from 'react-native-keyboard-controller';
import { Ionicons } from '@expo/vector-icons';
import { cn } from '@/tw/util';
import { Button } from './button';
import { Input } from './input';
import { useCreateComment, useGetExerciseComments, useGetApiAuthJag, useResolveComment, getExerciseComments } from '@/server/api';

type Comment = Awaited<ReturnType<typeof getExerciseComments>>[number];

type ExerciseCommentsSheetProps = {
    exerciseId: number | null;
};

const formatTimestamp = (iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString();
};

const displayName = (user?: { firstname?: string | null; lastname?: string | null; email?: string } | null) => {
    if (!user) return 'Unknown';
    const full = `${user.firstname ?? ''} ${user.lastname ?? ''}`.trim();
    return full || user.email || 'Unknown';
};

const CommentItem = ({ comment }: { comment: Comment }) => {
    const { data: me } = useGetApiAuthJag();
    const { mutateAsync: resolve, isPending } = useResolveComment();
    const isAuthor = me?.id != null && me.id === comment.user?.id;
    const isResolved = !!comment.resolved;

    return (
        <View className="px-5 py-3 border-b border-[#333435]">
            <View className="flex flex-row gap-3 items-start">
                <View className="flex-1 flex flex-col gap-1">
                    <View className="flex flex-row items-center gap-2">
                        <Text className="text-[#BAFFCA] font-semibold" numberOfLines={1}>
                            {displayName(comment.user)}
                        </Text>
                        {isResolved && (
                            <View className="bg-[#257560] rounded-full px-2 py-0.5">
                                <Text className="text-white text-[10px] font-semibold">Resolved</Text>
                            </View>
                        )}
                    </View>
                    <Text className="text-white">{comment.text}</Text>
                </View>
                <View className="flex flex-col items-end gap-1">
                    <Text className="text-[#BAFFCA]/50 text-xs">{formatTimestamp(comment.timestamp)}</Text>
                    {isAuthor && !isResolved && (
                        <Button
                            text={
                                <View className="flex flex-row items-center gap-1">
                                    <Ionicons name="checkmark-circle-outline" size={14} color="white" />
                                    <Text className="text-white font-semibold">Resolve</Text>
                                </View>
                            }
                            className="bg-[#257560] px-2 py-1"
                            isLoading={isPending}
                            onPress={() => resolve(comment.id)}
                        />
                    )}
                </View>
            </View>
        </View>
    );
};

const AddCommentDialog = ({ visible, exerciseId, onClose }: { visible: boolean; exerciseId: number | null; onClose: () => void }) => {
    const [text, setText] = useState('');
    const { height } = useKeyboardAnimation();
    const { mutateAsync, isPending } = useCreateComment({
        onSuccess: () => {
            setText('');
            onClose();
        },
    });

    const submit = async () => {
        if (!text.trim() || !exerciseId) return;
        await mutateAsync({ exerciseId, text: text.trim() });
    };

    return (
        <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
            <Pressable className="flex-1 bg-black/60 justify-center items-center px-6" onPress={onClose}>
                <Pressable
                    className="bg-[#232427] rounded-2xl p-5 w-full max-w-md gap-4"
                    onPress={(e) => e.stopPropagation()}
                >
                    <Text className="text-white text-xl font-bold">Add a comment</Text>
                    <Animated.View style={{ transform: [{ translateY: height }] }}>
                        <Input
                            label="Comment"
                            placeholder="Write your comment..."
                            value={text}
                            onChangeText={setText}
                            multiline
                            autoFocus
                            editable={!isPending}
                        />
                        <View className="mt-4">
                            <Button
                                text="Submit"
                                isLoading={isPending}
                                onPress={submit}
                                disabled={!text.trim() || !exerciseId}
                            />
                        </View>
                    </Animated.View>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

export const ExerciseCommentsSheet = forwardRef<BottomSheet, ExerciseCommentsSheetProps>(
    (props, ref) => {
        const { exerciseId } = props;
        const [showAddDialog, setShowAddDialog] = useState(false);

        const { data: comments, isLoading } = useGetExerciseComments(exerciseId);

        const sortedComments = useMemo(() => {
            if (!comments) return [];
            return [...comments].sort(
                (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
            );
        }, [comments]);

        return (
            <>
                <BottomSheet
                    ref={ref}
                    index={-1}
                    snapPoints={['50%']}
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
                    <View className="flex flex-col lg:self-center lg:w-200" style={{ flex: 1 }}>
                        <View className="flex flex-row items-center justify-between px-5 pb-3 border-b border-[#333435]">
                            <Text className="text-white text-xl font-bold">Comments</Text>
                            <Button
                                text={
                                    <View className="flex flex-row items-center gap-2">
                                        <Ionicons name="add" size={18} color="white" />
                                        <Text className="text-white font-semibold">Add</Text>
                                    </View>
                                }
                                className="bg-[#257560] px-3 py-2"
                                onPress={() => setShowAddDialog(true)}
                            />
                        </View>
                        {isLoading && (
                            <View className="flex-1 items-center justify-center">
                                <Text className="text-[#BAFFCA]/60">Loading comments...</Text>
                            </View>
                        )}
                        {!isLoading && comments && comments.length === 0 && (
                            <View className="flex-1 items-center justify-center px-5">
                                <Text className="text-[#BAFFCA]/60 text-center">
                                    No comments yet. Be the first to add one.
                                </Text>
                            </View>
                        )}
                        {!isLoading && sortedComments.length > 0 && (
                            <FlatList
                                data={sortedComments}
                                keyExtractor={(item) => String(item.id)}
                                renderItem={({ item }) => <CommentItem comment={item} />}
                                contentContainerStyle={{ flexGrow: 1 }}
                                style={{ flex: 1 }}
                            />
                        )}
                    </View>
                </BottomSheet>
                <AddCommentDialog
                    visible={showAddDialog}
                    exerciseId={exerciseId}
                    onClose={() => setShowAddDialog(false)}
                />
            </>
        );
    }
);

ExerciseCommentsSheet.displayName = 'ExerciseCommentsSheet';
