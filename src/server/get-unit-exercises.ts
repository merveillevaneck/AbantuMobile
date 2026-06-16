import { uniqueId } from "lodash";
import { apiClient } from "./api/client"

import { Buffer } from "buffer";

export const getUnitExercisesKey = ['exercises'];

export const getUnitExercises = async (unitId: number) => {
    console.log('fetching')
    const result = await apiClient.getApiunitsIdexercises({
        params: {
            id: unitId,
        }
    })

    return result.map(ex => ({
        ...ex,
        options: ex.options?.map(opt => ({
            uuid: uniqueId(),
            text: opt,
        })).sort(() => Math.random() - 0.5)
    }));
}