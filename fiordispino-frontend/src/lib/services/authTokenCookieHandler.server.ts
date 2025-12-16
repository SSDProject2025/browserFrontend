import type { Cookies } from '@sveltejs/kit';

export class AuthTokenCookieHandler {
    private readonly cookieName = 'token';

    constructor(private cookies: Cookies) {}

    setToken(token: string) {
        this.cookies.set(this.cookieName, token, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: true,
            maxAge: 60 * 60 * 24
        });
    }

    getToken(): string | undefined {
        return this.cookies.get(this.cookieName);
    }

    removeToken() {
        this.cookies.delete(this.cookieName, { path: '/' });
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }
}
