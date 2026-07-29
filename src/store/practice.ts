import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '@/server/api/client';
import { Platform } from 'react-native';
import { getUnitExercises } from '@/server/get-unit-exercises';

export type Exercise = Awaited<ReturnType<typeof getUnitExercises>>[number];

// Define the interface for your state

export type CompletedExercise = Exercise & {
  correct: boolean;
  answer: string[];
  startedAt: string;
  endedAt: string;
};
export type SessionResult = {
  newProgress: number;
  hasPreviousSession: boolean;
  mistakesDiff: number;
  correctDiff: number;
  timeDiff: number;
};

type PracticeStateFields = {
    exercises: Exercise[],
    completed: CompletedExercise[],
    current: Exercise | null;
    currentStartedAt: string | null;
    sessionId: number | null;
    lastSessionResult: SessionResult | null;
}

const DefaultStateValues: PracticeStateFields = {
  exercises: [],
  completed: [],
  current: null,
  currentStartedAt: null,
  sessionId: null,
  lastSessionResult: null,
}
interface IPracticeState {
    start: (exercises: Exercise[], sessionId: number) => void;
    end: () => void;
    complete: (correct: boolean, answer: string[], endedAt: string) => void;
    setSessionResult: (result: SessionResult | null) => void;
}

type PracticeState = PracticeStateFields & IPracticeState;

const isWeb = Platform.OS === "web";
// Create a custom storage object for Zustand
const zustandStorage: StateStorage = {
  setItem: async (name, value) => {
    if (isWeb) return localStorage.setItem(name, value);
    await AsyncStorage.setItem(name, value);
  },
  getItem: async (name) => {
    if (isWeb) return localStorage.getItem(name);
    const value = await AsyncStorage.getItem(name);
    return value;
  },
  removeItem: async (name) => {
    if (isWeb) return localStorage.removeItem(name);
    await AsyncStorage.removeItem(name);
  },
};


const determineNextExercise = (state: PracticeStateFields) => {
    if (state.exercises.length === 0) return null;
    return state.exercises[0];
}


const completeCurrentExercise = (state: PracticeStateFields, correct: boolean, answer: string[], endedAt: string) => {
  const { completed, exercises, current, currentStartedAt } = state;
  const nextExercise = determineNextExercise(state);
  const $completed = current
    ? [...completed, { ...current, correct, answer, startedAt: currentStartedAt ?? endedAt, endedAt }]
    : completed;
  return {
    ...state,
    completed: $completed,
    current: nextExercise,
    currentStartedAt: nextExercise ? new Date().toISOString() : null,
    exercises: nextExercise ? exercises.slice(1) : exercises,
  };
}

const start = (exercises: Exercise[], sessionId: number) => {
  const state = { ...DefaultStateValues, exercises, sessionId };
  const firstExercise = determineNextExercise(state);
  const $exercises = firstExercise ? exercises.slice(1) : [];

  return {
    ...state,
    exercises: $exercises,
    current: firstExercise ?? null,
    currentStartedAt: firstExercise ? new Date().toISOString() : null,
  }
}


    //   username: '',
    //   isLoggedIn: false,
    //   login: (name) => set({ username: name, isLoggedIn: true }),
    //   logout: () => set({ username: '', isLoggedIn: false }),

// Create the store
export const usePracticeStore = create<PracticeState>()(
  persist(
    (set) => ({
      ...DefaultStateValues,
        complete: (correct, answer: string[], endedAt: string) => set(state => completeCurrentExercise(state, correct, answer, endedAt)),

        end: () => set({ ...DefaultStateValues }),
        //next: () => set({}),
        setSessionResult: (result: SessionResult | null) => set({ lastSessionResult: result }),
        start: (exercises: Exercise[], sessionId: number) => set(start(exercises, sessionId))
    }),
    {
      name: 'user-storage', // unique name for the storage key
      storage: createJSONStorage(() => zustandStorage), // use the custom storage object
    }
  )
);
