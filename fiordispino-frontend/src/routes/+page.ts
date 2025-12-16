import { gameService } from '$lib/services/games';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
    try {
        const games = await gameService.getAll(fetch);
        return {
            games: games,
            error: null
        };
    } catch (e) {
        console.error(e);
        return {
            games: [],
            error: 'Error on loading games'
        };
    }
};