export interface RegisterUserRequest {
    username: string;
    email: string;
    password1: string;
    password2: string;
}

export interface TokenResponse {
    key: string;
}

export interface LoginUserRequest {
    email: string;
    password: string;
}