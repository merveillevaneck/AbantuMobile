import { apiClient } from "./api/client"

export const getUnitExercisesKey = ['exercises'];

export const getUnitExercises = async (unitId: number) => {
    const result = await apiClient.getApiunitsIdexercises({
        params: {
            id: unitId,
        }
    })

    return result;
}