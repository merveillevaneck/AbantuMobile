import z from "zod";
import { schemas } from "./generated-client";
import { apiClient } from "./client";
import { useMutation } from "@tanstack/react-query";
import { ResponseOf } from "./responses";

const loginParams = schemas.postApiauthlogin_Body;

type LoginResponse =  ResponseOf<'postApiauthlogin'>;
type LoginParams = z.infer<typeof loginParams>

export const postApiAuthLoginKey = () => ["PostApiAuthLogin"];

export const postApiAuthLogin = async (opts: LoginParams) => await apiClient.postApiauthlogin(opts);

export type UsePostApiAuthLoginOpts = {
    onSuccess: (data?: LoginResponse) => Promise<void>
}

export const usePostApiAuthLogin = (opts: UsePostApiAuthLoginOpts) => useMutation({
    mutationFn: postApiAuthLogin,
    mutationKey: postApiAuthLoginKey(),
    ...opts,
})