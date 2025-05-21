import axios from 'axios';

const API_BASE_URL = `${process.env.REACT_APP_API_URL}/api/v1`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log('Making request:', {
      method: config.method,
      url: config.url,
      data: config.data,
      headers: config.headers,
    });
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging
api.interceptors.response.use(
  (response) => {
    console.log('Received response:', {
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error('Response error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    return Promise.reject(error);
  }
);

export interface Policy {
  id: number;
  name: string;
  description: string;
  category: 'CSPM' | 'Posture' | 'Gating' | 'Drift' | 'Settings' | 'DevOps' | 'FIM' | 'Anti-malware';
  type: 'Default' | 'Built-in' | 'Custom';
  priority: number;
  status: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreatePolicyData {
  name: string;
  description: string;
  category: 'CSPM' | 'Posture' | 'Gating' | 'Drift' | 'Settings' | 'DevOps' | 'FIM' | 'Anti-malware';
  type: 'Default' | 'Built-in' | 'Custom';
  priority?: number;
  status: boolean;
}

const policyService = {
  async getPolicies(): Promise<Policy[]> {
    const { data } = await api.get<Policy[]>('/policies');
    return data;
  },

  async createPolicy(data: CreatePolicyData): Promise<Policy> {
    try {
      console.log('Creating policy with data:', JSON.stringify(data, null, 2));
      const { data: responseData } = await api.post<Policy>('/policies', data);
      console.log('Policy created successfully:', responseData);
      return responseData;
    } catch (error: any) {
      console.error('Error in createPolicy:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        requestData: data,
        fullError: error
      });
      throw error;
    }
  },

  async updatePolicy(id: number, data: Partial<CreatePolicyData>): Promise<Policy> {
    const { data: responseData } = await api.put<Policy>(`/policies/${id}`, data);
    return responseData;
  },

  async deletePolicy(id: number): Promise<void> {
    await api.delete(`/policies/${id}`);
  },

  async togglePolicyStatus(id: number, status: boolean): Promise<Policy> {
    const { data } = await api.patch<Policy>(`/policies/${id}/status`, { status });
    return data;
  },
};

export default policyService; 