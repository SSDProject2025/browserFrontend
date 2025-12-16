import { json } from '@sveltejs/kit';
import { AuthTokenCookieHandler } from '$lib/services/authTokenCookieHandler.server';

type AuthAction = 'login' | 'logout';

export const POST = async ({ request, cookies }) => {
    const { action, token } = await request.json();

    const authCookie = new AuthTokenCookieHandler(cookies);

    switch (action as AuthAction) {
        case 'login': {
            if (!token) {
                return json(
                    { error: 'Token is required' },
                    { status: 400 }
                );
            }

            authCookie.setToken(token);
            return json({ success: true });
        }

        case 'logout': {
            authCookie.removeToken();
            return json({ success: true });
        }

        default:
            return json(
                { error: 'Invalid auth action' },
                { status: 400 }
            );
    }
};