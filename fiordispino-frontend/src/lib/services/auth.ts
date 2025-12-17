import type {LoginUserRequest, RegisterUserRequest, User} from "$lib/types/api.types";
import {PUBLIC_API_SERVER_BASE_URL} from "$env/static/public";

export const authService = {

    login: async (credentials: LoginUserRequest) => {
        const loginRes = await fetch(`${PUBLIC_API_SERVER_BASE_URL}/auth/login/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });

        if (!loginRes.ok) {
            await loginRes.json();
            throw new Error("Invalid credentials");
        }

        const loginData = await loginRes.json();
        const token = loginData.key;

        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('token', token);
        }

        const userRes = await fetch(`${PUBLIC_API_SERVER_BASE_URL}/auth/user/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            }
        });

        if (!userRes.ok) {
            throw new Error('Unable to retrieve user profile');
        }

        const userData: User = await userRes.json();

        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(userData));
        }

        return { token, user: userData };
    },

    register: async (credentials: RegisterUserRequest) => {
        const res = await fetch(`${PUBLIC_API_SERVER_BASE_URL}/auth/registration/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });

        if (!res.ok) {
            const err = await res.json();

            let errorMessage = 'Error during registration';

            if (err.non_field_errors?.length > 0) {
                errorMessage = err.non_field_errors[0];
            } else {
                const firstField = Object.keys(err)[0];
                if (firstField && err[firstField]?.[0]) {
                    errorMessage = `${firstField}: ${err[firstField][0]}`;
                }
            }

            throw new Error(errorMessage);
        }

        const regData = await res.json();
        const token = regData.key;

        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('token', token);
        }

        const userRes = await fetch(`${PUBLIC_API_SERVER_BASE_URL}/auth/user/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            }
        });

        if (!userRes.ok) {
            throw new Error('Unable to retrieve user profile');
        }

        const userData: User = await userRes.json();

        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(userData));
        }

        return { token, user: userData };
    },

    logout: async () => {
        try {
            await fetch(`${PUBLIC_API_SERVER_BASE_URL}/auth/logout/`, {
                method: 'POST',
            });

            if (typeof localStorage !== 'undefined') {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        } catch (e) {
            console.error("Logout failed", e);
        }
    },

    getCurrentUser: (): User | null => {
        if (typeof localStorage === 'undefined') {
            return null;
        }

        const userStr = localStorage.getItem('user');
        if (!userStr) return null;

        try {
            return JSON.parse(userStr) as User;
        } catch (e) {
            console.error("User parsing error", e);
            return null;
        }
    }
}