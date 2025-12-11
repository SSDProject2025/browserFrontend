import axios, {AxiosError, AxiosHeaders, type AxiosInstance, type AxiosRequestConfig} from "axios";
import { PUBLIC_API_SERVER_BASE_URL } from '$env/static/public';
import { AuthTokenHandler } from "$lib/services/authTokenHandler";

export class ApiClient {

    private baseUrl: string;
    private headers: AxiosHeaders;
    private authTokenHandler: AuthTokenHandler;

    constructor(
    ) {
        this.baseUrl = PUBLIC_API_SERVER_BASE_URL;
        this.headers = new AxiosHeaders()
        this.authTokenHandler = new AuthTokenHandler();
    }

    public async get(endpoint: string = "", params?: any, signal?: AbortSignal): Promise<any> {
        try {
            const client = this.createClient(params);
            const response = await client.get(this.baseUrl + endpoint, { signal });
            return response.data;
        } catch (error: any) {
            throw error;
        }
    }

    public async post(endpoint: string = "", data?: any, signal?: AbortSignal): Promise<any> {
        try {
            const client = this.createClient();
            const response = await client.post(this.baseUrl + endpoint, data, { signal });
            return response.data;
        } catch (error: any) {
            throw error;
        }
    }

    private createClient(params: object = {}): AxiosInstance {
        const config: AxiosRequestConfig = {
            baseURL: this.baseUrl,
            headers: this.headers,
            params: params
        }
        if(this.authTokenHandler.getToken()) {
            config.headers = {
                Authorization: `Token ${this.authTokenHandler.getToken()}`,
            }
        }
        return axios.create(config);
    }

    private handleError(error: any): never {
        if (!error.response) {
            throw new AxiosError('Connection error');
        } else {
            switch (error.response.status) {
                case 400:
                    throw new AxiosError('Bad Request');
                case 401:
                    throw new AxiosError('Unauthorized');
                case 403:
                    throw new AxiosError('Forbidden');
                default:
                    throw error;
            }
        }
    }
}