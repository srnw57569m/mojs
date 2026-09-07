const axios = require('axios');

class HttpClient {
    constructor(config = {}) {
        this.client = axios.create({
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            ...config
        });
    }

    async #request(method, url, data = {}, params = {}) {
        return this.client({ method, url, data, params })
            .then(res => res.data);
    }

    async get(url, params) {
        return await this.#request('get', url, null, params);
    }

    async post(url, data) {
        return await this.#request('post', url, data);
    }

    async put(url, data) {
        return await this.#request('put', url, data);
    }

    async patch(url, data) {
        return await this.#request('patch', url, data);
    }
    
    async delete(url, params) {
        return await this.#request('delete', url, null, params);
    }

    withToken(token) {
        return new HttpClient({
            ...this.client.defaults,
            headers: {
                ...this.client.defaults.headers,
                Authorization: `Bearer ${token}`
            }
        });
    }
}

module.exports = HttpClient;