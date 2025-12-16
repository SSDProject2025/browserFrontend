import { PUBLIC_API_SERVER_BASE_URL } from '$env/static/public';
import type { Game } from '$lib/types/api.types';

export const gameService = {
    getAll: async (fetchFunction = fetch): Promise<Game[]> => {
        const response = await fetchFunction(`${PUBLIC_API_SERVER_BASE_URL}/game/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error on loading games.');
        }

        const data = await response.json();

        if (Array.isArray(data)) {
            return data;
        }

        return [];
    }
};