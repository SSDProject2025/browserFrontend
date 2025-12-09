import { error } from '@sveltejs/kit';

class ApiClient {

    baseUrl: string;

    constructor(_baseUrl: string) {
        this.baseUrl = _baseUrl;
    }


}