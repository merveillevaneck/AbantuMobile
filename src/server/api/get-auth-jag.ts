import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./client";

export const getApiAuthJagKey = () => ["GetApiAuthJag"];

export const useGetApiAuthJag = () => useQuery({
    queryFn: () => apiClient.getApiauthjag(),
    queryKey: getApiAuthJagKey(),
});
