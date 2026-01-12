import { createApiClient } from '@/server/api/generated-client';
import { getToken } from '@/store/token';

const API = "http://localhost:3000";

export const apiClient = createApiClient(API)

apiClient.axios.interceptors.request.use(async ctx => {
    const headers = ctx.headers;
    const token = await getToken();
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return {...ctx, headers: headers}
})
