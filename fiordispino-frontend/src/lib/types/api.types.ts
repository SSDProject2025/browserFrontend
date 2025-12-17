export interface RegisterUserRequest {
    username: string;
    email: string;
    password: string;
    password2: string;
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
    global_rating: string;
    pegi: number;
    rating_count: number;
    release_date: Date;
    title: string;
}

export interface Genre {
    id: number;
    name: string;
}

export interface GenreInfo {
    id: number;
    name: string;
}

export interface User {
    username: string;
    email: string;
    pk: number;
    is_superuser: boolean;
}
export interface GamePlayed {
    id: number;
    owner: number;
    game: Game;
    rating: number;
}