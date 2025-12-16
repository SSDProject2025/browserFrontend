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

export interface User {
    username: string;
    email: string;
    id: number;
    is_superuser: boolean;
}
export interface Game {
    id: number;
    box_art: string;
    description: string;
    title: string;
    genres: Genre[];
    pegi: number;
    "release_date": string;
}

export interface Genre {
    id: number;
}

export interface GenreInfo {
    id: number;
    name: string;
}
