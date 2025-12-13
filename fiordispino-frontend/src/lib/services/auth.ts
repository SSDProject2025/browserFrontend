import { ApiClient } from "./api"
import { AuthTokenHandler } from "$lib/services/authTokenHandler";
import type {LoginUserRequest, RegisterUserRequest, TokenResponse} from "$lib/types/api.types";
import {AxiosError} from "axios";

export class AuthService {

    private apiClient: ApiClient;
    private authTokenHandler: AuthTokenHandler;

    constructor(){
        this.apiClient = new ApiClient();
        this.authTokenHandler = new AuthTokenHandler();
    }

    async login(loginUserRequest: LoginUserRequest): Promise<any> {
        return this.apiClient.post("/auth/login/", loginUserRequest).then(response => {
            const tokenResponse = response as TokenResponse;
            this.authTokenHandler.setToken(tokenResponse.key);
        }).catch(error => {
            throw new AxiosError(Object.values(error.response.data).flat().join('\n'));
            //this.handleLoginError(error);
        });
    }

    async register(registerUserRequest: RegisterUserRequest): Promise<any> {
        return this.apiClient.post("/auth/registration/", registerUserRequest).then(response  => {
            const tokenResponse = response as TokenResponse;
            this.authTokenHandler.setToken(tokenResponse.key);
        }).catch(error => {
            throw new AxiosError(Object.values(error.response.data).flat().join('\n'));
        });
    }

    async logout(): Promise<any> {
        if(this.authTokenHandler.getToken() == null){
            console.log("No Token Found");
            return;
        } else {
            return this.apiClient.post("/auth/logout/").then(response => {
                console.log(response);
            }).catch(error => {
                throw error;
            }).finally(() => {
                this.authTokenHandler.removeToken()
            });
        }
    }

    private handleLoginError(error: any): never {
        if (!error.response) {
            throw new AxiosError('Connection error');
        } else {
            switch (error.response.status) {
                case 400:
                    throw new AxiosError('Wrong Credentials');
                case 401:
                    throw new AxiosError('Unauthorized');
                case 403:
                    throw new AxiosError('Forbidden');
                case 500:
                    throw new AxiosError('Server Error');
                default:
                    throw error;
            }
        }
    }
}

export const authService = new AuthService()