export class AuthTokenHandler {

    constructor() {}

    setToken(token: string): any {
        localStorage.setItem("token", token);
    }

    getToken(): any {
        return localStorage.getItem("token")
    }

    removeToken(): any {
        localStorage.removeItem("token");
    }
}