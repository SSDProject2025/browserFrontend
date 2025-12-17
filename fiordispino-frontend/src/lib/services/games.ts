import {PUBLIC_API_SERVER_BASE_URL} from '$env/static/public';
import type {Game} from '$lib/types/api.types';

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
    },

    getById: async (id: number, fetchFunction = fetch) => {
       const res = await fetchFunction(`${PUBLIC_API_SERVER_BASE_URL}/game/${id}/`, {
           method: 'GET',
           headers: {
               'Content-Type': 'application/json'
           }
       });

       if (!res.ok) throw new Error('Not found');

       return await res.json();
    },

    getSelfGamesPlayed: async (fetchFunction = fetch) => {
        let authToken;
        if (!authToken && typeof localStorage !== 'undefined') {
            authToken = localStorage.getItem('token');
        }

        if (!authToken) {
            throw new Error('Unauthenticated user');
        }

        const res = await fetchFunction(`${PUBLIC_API_SERVER_BASE_URL}/games-played/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${authToken}`
            }
        });

        if (!res.ok) {
            throw new Error('Unable to recover played games');
        }

        return await res.json();
    },

    getSelfGamesToPlay: async (fetchFunction = fetch) => {
        let authToken;
        if (!authToken && typeof localStorage !== 'undefined') {
            authToken = localStorage.getItem('token');
        }

        if (!authToken) {
            throw new Error('Unauthenticated user');
        }

        const res = await fetchFunction(`${PUBLIC_API_SERVER_BASE_URL}/games-to-play/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${authToken}`
            }
        });

        if (!res.ok) {
            throw new Error('Unable to recover games to play');
        }

        return await res.json();
    },
};