export interface RegisterUserRequest {
    username: string;
    email: string;
    password: string;
    password2: string;
}

export interface TokenResponse {
    key: string;
}

export interface LoginUserRequest {
    email: string;
    password: string;
}