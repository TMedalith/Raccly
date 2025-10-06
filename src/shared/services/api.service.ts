import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = 'https://h5t2frwm11.execute-api.us-east-1.amazonaws.com/poc';

interface ChatRequest {
  prompt: string;
  sessionId: string;
}

interface ChatResponse {
  response: string;
  sessionId: string;
  agent_alias_id: string;
  references?: string[];
}

export class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'QG5HtOLSkc7NxMQWDTsft6ppq1TD1Rln3rISP6O8',
      },
      timeout: 30000,     });

        this.client.interceptors.request.use(
      (config) => {
        console.log('API Request:', config.method?.toUpperCase(), config.url, config.data);
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

        this.client.interceptors.response.use(
      (response) => {
        console.log('API Response:', response.status, response.data);
        return response;
      },
      (error: AxiosError) => {
        console.error('API Error:', error.message, error.response?.data);
        return Promise.reject(error);
      }
    );
  }

  async sendChatMessage(prompt: string, sessionId: string): Promise<ChatResponse> {
    try {
      const request: ChatRequest = {
        prompt,
        sessionId,
      };

      const response = await this.client.post<ChatResponse>('/chat', request);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error communicating with server');
      }
      throw error;
    }
  }
}

export const apiService = new ApiService();
