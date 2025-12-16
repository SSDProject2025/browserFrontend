import { ApiClient } from "./api"
import { AuthTokenHandler } from "$lib/services/authTokenHandler";
import type {Game, LoginUserRequest, RegisterUserRequest, TokenResponse, User} from "$lib/types/api.types";
import {AxiosError} from "axios";

export class AuthService {

    private apiClient: ApiClient;
    private authTokenHandler: AuthTokenHandler;

    constructor(){
        this.apiClient = new ApiClient();
        this.authTokenHandler = new AuthTokenHandler();
    }

    async login(loginUserRequest: LoginUserRequest): Promise<any> {
        return this.apiClient.post("/auth/login/", loginUserRequest).then(async response => {
            const tokenResponse = response as TokenResponse;
            this.authTokenHandler.setToken(tokenResponse.key);
            await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'login',
                    token: tokenResponse.key
                })
            });
        }).catch(error => {
            throw new AxiosError(Object.values(error.response.data).flat().join('\n'));
            //this.handleLoginError(error);
        });
    }

    async register(registerUserRequest: RegisterUserRequest): Promise<any> {
        return this.apiClient.post("/auth/registration/", registerUserRequest).then(async response  => {
            const tokenResponse = response as TokenResponse;
            this.authTokenHandler.setToken(tokenResponse.key);
            await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'login',
                    token: tokenResponse.key
                })
            });
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
            }).finally(async () => {
                this.authTokenHandler.removeToken()
                await fetch('/api/auth', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'logout'
                    })
                });
            });
        }
    }

    async getUser(): Promise<any> {
        if(this.authTokenHandler.getToken() == null){
            console.log("No Token Found");
            return;
        } else {
            return this.apiClient.get("/user/me/").then(response => {
                return response as User;
            }).catch(error => {
                console.log(error);
            })
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