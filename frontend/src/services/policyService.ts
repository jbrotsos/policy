import axios from 'axios';
import { Policy, CreatePolicyData, PolicyFilters } from '../types/policy';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

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

export const usePolicyService = () => {
  const getPolicies = async (filters?: PolicyFilters): Promise<Policy[]> => {
    const response = await axios.get<Policy[]>(`${API_BASE_URL}/api/policies`, { params: filters });
    return response.data;
  };

  const createPolicy = async (data: CreatePolicyData): Promise<Policy> => {
    const response = await axios.post<Policy>(`${API_BASE_URL}/api/policies`, data);
    return response.data;
  };

  const updatePolicy = async (id: number, data: Partial<Policy>): Promise<Policy> => {
    const response = await axios.put<Policy>(`${API_BASE_URL}/api/policies/${id}`, data);
    return response.data;
  };

  const deletePolicy = async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/api/policies/${id}`);
  };

  return {
    getPolicies,
    createPolicy,
    updatePolicy,
    deletePolicy,
  };
};

export default usePolicyService; 