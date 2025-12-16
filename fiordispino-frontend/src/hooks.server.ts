import { AuthTokenCookieHandler } from '$lib/services/authTokenCookieHandler.server';
import { redirect } from '@sveltejs/kit';

export const handle = async ({ event, resolve }) => {
    const auth = new AuthTokenCookieHandler(event.cookies);

    if (event.route.id?.includes('(protected)')) {
        if (!auth.getToken()) {
            throw redirect(303, '/auth');
        }
    }

    return resolve(event);
};