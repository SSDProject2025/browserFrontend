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
    owner: number;
    game: GameDetails;
    created_at: string; // ISO date string
}

export interface GameDetails {
    id: number;
    box_art: string;
    description: string;
    title: string;
    genres: number[];
    pegi: number;
    release_date: string;
    global_rating: string;
    rating_count: number;
}

export interface GenreInfo {
    id: number;
    name: string;
}
