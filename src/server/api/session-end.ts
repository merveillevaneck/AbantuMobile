import z from "zod";
import { schemas } from "./generated-client";
import { apiClient } from "./client";
import { useMutation } from "@tanstack/react-query";
import { ResponseOf } from "./responses";

const params = schemas.postApistudentsessionend_Body;
type Params = z.infer<typeof params>;
type Response = ResponseOf<"postApistudentsessionend">;

export const postApiStudentSessionEndKey = () => ["PostApiStudentSessionEnd"];
export const postApiStudentSessionEnd = async (opts: Params): Promise<Response> =>
  await apiClient.postApistudentsessionend({ body: opts });

export const usePostApiStudentSessionEnd = () =>
  useMutation({
    mutationFn: postApiStudentSessionEnd,
    mutationKey: postApiStudentSessionEndKey(),
  });
