import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { paths } from '@/server/schema';

type Unit = paths['/api/units/{id}']['get']['responses'][200]['content']['application/json'];
type Exercises = paths['/api/units/{id}/exercises']['get']['responses'][200]['content']['application/json'];
type Exercise = Exercises[number];
// Define the interface for your state
interface PracticeState {
    exercises: Exercises,
    start: (exercises: Exercises) => void;
    completed: Exercises,
    end: () => void;
    next: () => void;
    current: Exercise | null;
}

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

const determineNextExercise = (state: PracticeState) => {
    if (state.exercises.length === 0) return null;
    if (state.exercises.length === 1) return 
    if (state.current === null) return {}
}


    //   username: '',
    //   isLoggedIn: false,
    //   login: (name) => set({ username: name, isLoggedIn: true }),
    //   logout: () => set({ username: '', isLoggedIn: false }),

// Create the store
// export const useUserStore = create<PracticeState>()(
//   persist(
//     (set) => ({
//         exercises: [],
//         current: null,
//         next: null,
//         end: () => set({exercises: [], current: null}),
//         //next: () => set({}),
//         start: (exercises: Exercises) => ({exercises})
//     }),
//     {
//       name: 'user-storage', // unique name for the storage key
//       storage: createJSONStorage(() => zustandStorage), // use the custom storage object
//     }
//   )
// );
