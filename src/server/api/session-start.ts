import { apiClient } from "./client";
import { useMutation } from "@tanstack/react-query";
import { ResponseOf } from "./responses";

type Params = { unitId?: number };
type Response = ResponseOf<"postApistudentsessionstart">;

export const postApiStudentSessionStartKey = () => ["PostApiStudentSessionStart"];
export const postApiStudentSessionStart = async (opts: Params): Promise<Response> =>
  await apiClient.postApistudentsessionstart({ body: opts });

export const usePostApiStudentSessionStart = () =>
  useMutation({
    mutationFn: postApiStudentSessionStart,
    mutationKey: postApiStudentSessionStartKey(),
  });
