import { ApiClient } from "./api"
import type {Game, GameDetails, GenreInfo} from "$lib/types/api.types";
import {AxiosError} from "axios";

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
}

export const gameService = new GameService()