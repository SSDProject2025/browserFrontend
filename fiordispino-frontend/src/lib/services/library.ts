import { ApiClient } from "./api"
import type {Game} from "$lib/types/api.types";
import {AxiosError} from "axios";

export class LibraryService {

    private apiClient: ApiClient;

    constructor(){
        this.apiClient = new ApiClient();
    }

    async getGamesPlayedFromUsername(username: string): Promise<Game[]> {
        return this.apiClient.get("/games-played/owner/" + username).then(response => {
            return response as Game[];
        }).catch(error => {
            throw new AxiosError(Object.values(error.response.data).flat().join('\n'));
        });
    }

    async getGamesToPlayFromUsername(username: string): Promise<Game[]> {
        return this.apiClient.get("/games-to-play/owner/" + username).then(response => {
            return response as Game[];
        }).catch(error => {
            throw new AxiosError(Object.values(error.response.data).flat().join('\n'));
        });
    }
}

export const libraryService = new LibraryService()