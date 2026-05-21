import { createApiClient } from '@/server/api/generated-client';
import { getToken } from '@/store/token';

const API = "http://localhost:3001";
//const API = "http://192.168.0.104:3000";
// const API = "https://mervstation.tail4f070.ts.net";
//const API = "https://merveilles-macbook-air.tail4f070.ts.net/abantube";

export const apiClient = createApiClient(API)

apiClient.axios.interceptors.request.use(async ctx => {
    const headers = ctx.headers;
    const token = await getToken();
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return {...ctx, headers: headers}
})
