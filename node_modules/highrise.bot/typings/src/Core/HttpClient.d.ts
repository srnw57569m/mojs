import { AxiosInstance, AxiosRequestConfig } from 'axios';

/**
 * A lightweight HTTP client wrapper using axios.
 */
declare class HttpClient {
    private client: AxiosInstance;

    /**
     * @param config - Standard Axios request configuration.
     * @example
     * const client = new HttpClient({ baseURL: 'https://api.example.com' });
     */
    constructor(config?: AxiosRequestConfig);

    /**
     * Performs an HTTP GET request.
     * @param url - The request endpoint.
     * @param params - URL query parameters to be serialized.
     * @example
     * const users = await client.get('/users', { active: true }); //users?active=true
     */
    get(url: string, params?: any): Promise<T>;

    /**
     * Performs an HTTP POST request.
     * @param url - The request endpoint.
     * @param data - The request payload object.
     * @example
     * const newUser = await client.post('/users', { name: 'John Doe' });
     */
    post(url: string, data?: any): Promise<T>;

    /**
     * Performs an HTTP PUT request.
     * @param url - The request endpoint.
     * @param data - The request payload object.
     * @example
     * await client.put('/users/1', { name: 'John Updated' });
     */
    put(url: string, data?: any): Promise<T>;

    /**
     * Performs an HTTP PATCH request.
     * @param url - The request endpoint.
     * @param data - The request payload object.
     * @example
     * await client.patch('/users/1', { email: 'new@example.com' });
     */
    patch(url: string, data?: any): Promise<T>;

    /**
     * Performs an HTTP DELETE request.
     * @param url - The request endpoint.
     * @param params - URL query parameters.
     * @example
     * await client.delete('/users/1');
     */
    delete(url: string, params?: any): Promise<T>;

    /**
     * Creates a new isolated instance of HttpClient with the Authorization header added.
     * @param token - The bearer token to be added to the Authorization header.
     * @returns A new HttpClient instance.
     * @example
     * const authClient = client.withToken('eyJhbGciOiJIUz...');
     * await authClient.get('/profile');
     */
    withToken(token: string): HttpClient;
}

export default HttpClient;