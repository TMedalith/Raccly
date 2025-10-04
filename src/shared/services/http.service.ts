import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export abstract class HttpService {
  protected client: AxiosInstance;

  constructor(baseURL: string = '/api') {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  protected async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(endpoint, config);
    return response.data;
  }

  protected async post<T>(endpoint: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(endpoint, body, config);
    return response.data;
  }

  protected async put<T>(endpoint: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(endpoint, body, config);
    return response.data;
  }

  protected async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(endpoint, config);
    return response.data;
  }
}
