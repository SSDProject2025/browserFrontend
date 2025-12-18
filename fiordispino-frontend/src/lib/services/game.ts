import { ApiClient } from "./api"
import type {Game, GameDetails, GenreInfo} from "$lib/types/api.types";
import {AxiosError} from "axios";
import {PUBLIC_API_SERVER_BASE_URL} from "$env/static/public";

export class GameService {

    private apiClient: ApiClient;

    constructor(){
        this.apiClient = new ApiClient();
    }

    async getGenreById(id: number): Promise<GenreInfo> {
        return this.apiClient.get("/genre/" + id).then(response => {
            return response as GenreInfo;
        }).catch(error => {
            throw new AxiosError(Object.values(error.response.data).flat().join('\n'));
        });
    }

    async getGenres(): Promise<GenreInfo[]> {
        return this.apiClient.get("/genre/").then(response => {
            return response as GenreInfo[];
        }).catch(error => {
            throw new AxiosError(Object.values(error.response.data).flat().join('\n'));
        });
    }

    async getAll(): Promise<GameDetails[]> {
        return this.apiClient.get("/game/").then(response => {
            return response as GameDetails[];
        }).catch(error => {
            throw new AxiosError(Object.values(error.response.data).flat().join('\n'));
        });
    }

    async getById(id: number): Promise<GameDetails> {
        return this.apiClient.get(`/game/${id}`).then(response => {
            return response as GameDetails;
        }).catch(error => {
            throw new AxiosError(Object.values(error.response.data).flat().join('\n'));
        });
    }

    async addGameToPlay(id: number) {
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error("User not authenticated");
        }

        const res = await fetch(`${PUBLIC_API_SERVER_BASE_URL}/games-to-play/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify({
                game: id
            })
        });

        if (!res.ok) {
            let errorMessage = "Failed to add game to backlog";
            try {
                const errorData = await res.json();
                errorMessage = errorData.detail || JSON.stringify(errorData);
            } catch (e) {}
            throw new Error(errorMessage);
        }

        return await res.json();
    }

    async addGamePlayed(id: number, rating: number) {
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error("User not authenticated");
        }

        const res = await fetch(`${PUBLIC_API_SERVER_BASE_URL}/games-played/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify({
                game: id,
                rating: rating
            })
        });

        if (!res.ok) {
            let errorMessage = "Failed to add game to played list";
            try {
                const errorData = await res.json();
                errorMessage = errorData.detail || JSON.stringify(errorData);
            } catch (e) { }

            throw new Error(errorMessage);
        }

        return await res.json();
    }

    async movePlayedToBacklog(playedInstanceId: number) {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("User not authenticated");

        const res = await fetch(`${PUBLIC_API_SERVER_BASE_URL}/games-played/${playedInstanceId}/move-in-to-play/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            }
        });

        if (!res.ok) {
            throw new Error("Failed to move game to backlog");
        }

        return true;
    }

    async moveBacklogToPlayed(toPlayInstanceId: number, rating: number) {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("User not authenticated");

        const res = await fetch(`${PUBLIC_API_SERVER_BASE_URL}/games-to-play/${toPlayInstanceId}/move-in-played/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify({
                rating: rating
            })
        });

        if (!res.ok) {
            let errorMessage = "Failed to move game to played";
            try {
                const data = await res.json();
                errorMessage = data.detail || errorMessage;
            } catch (e) {}
            throw new Error(errorMessage);
        }

        return true;
    }

    async updateGameRating(playedInstanceId: number, gameId: number, rating: number) {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("User not authenticated");

        const res = await fetch(`${PUBLIC_API_SERVER_BASE_URL}/games-played/${playedInstanceId}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify({
                game: gameId,
                rating: rating
            })
        });

        if (!res.ok) throw new Error("Failed to update rating");
        return await res.json();
    }
}

export const gameService = new GameService()