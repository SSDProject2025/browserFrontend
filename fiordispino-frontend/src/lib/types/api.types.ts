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

export interface Genre {
    id: number;
    name: string;
}

export interface Game {
    id: number;
    box_art: string;
    description: string
    genres: Genre[];
    global_rating: number;
    pegi: number;
    rating_count: number;
    release_date: Date;
    title: string;
}