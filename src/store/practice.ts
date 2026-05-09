import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '@/server/api/client';

type Exercise = Awaited<ReturnType<typeof apiClient.getApiunitsIdexercises>>[number];
// Define the interface for your state

export type CompletedExercise = Exercise & {correct: boolean, answer: string[]};
type PracticeStateFields = {
    exercises: Exercise[],
    completed: CompletedExercise[],
    current: Exercise | null;
}

const DefaultStateValues: PracticeStateFields = {
  exercises: [],
  completed: [],
  current: null,
}
interface IPracticeState {
    start: (exercises: Exercise[]) => void;
    end: () => void;
    complete: (correct: boolean, answer: string[]) => void;
}

type PracticeState = PracticeStateFields & IPracticeState;

// Create a custom storage object for Zustand
const zustandStorage: StateStorage = {
  setItem: async (name, value) => {
    await AsyncStorage.setItem(name, value);
  },
  getItem: async (name) => {
    const value = await AsyncStorage.getItem(name);
    return value;
  },
  removeItem: async (name) => {
    await AsyncStorage.removeItem(name);
  },
};


const determineNextExercise = (state: PracticeStateFields) => {
    if (state.exercises.length === 0) return null;
    return state.exercises[0];
}


const completeCurrentExercise = (state: PracticeStateFields, correct: boolean, answer: string[]) => {
  const { completed, exercises, current } = state;
  const nextExercise = determineNextExercise(state);
  const $completed = current ? [...completed, {...current, correct, answer: answer}] : completed;
  const $current = nextExercise;
  const $exercises = nextExercise ? exercises.slice(1) : exercises;

  return {...state, completed: $completed, current: $current, exercises: $exercises}
}

const start = (exercises: Exercise[]) => {
  const state = {...DefaultStateValues, exercises};
  const firstExercise = determineNextExercise(state);
  const $exercises = !!firstExercise ? exercises.slice(1) : [];

  return {
    ...state,
    exercises: $exercises,
    current: firstExercise ?? null,
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
        complete: (correct, answer: string[]) => set(state => completeCurrentExercise(state, correct, answer)),

        end: () => set({exercises: [], current: null}),
        //next: () => set({}),
        start: (exercises: Exercise[]) => set(start(exercises))
    }),
    {
      name: 'user-storage', // unique name for the storage key
      storage: createJSONStorage(() => zustandStorage), // use the custom storage object
    }
  )
);
