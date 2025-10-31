import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 120000, // 2 minutes for AI operations
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      console.error('Network Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;

// API methods
export const api = {
  analyzeRepo: (repoUrl: string) =>
    apiClient.post('/api/analyze-repo', { repoUrl }),

  generateDockerfile: (data: { analysis: any; structure: any; repoUrl: string }) =>
    apiClient.post('/api/generate-dockerfile', data),

  deploy: (data: { projectId: string; dockerfile: string; projectName: string }) =>
    apiClient.post('/api/deploy', data),

  getDeployment: (deploymentId: string) =>
    apiClient.get(`/api/deployments/${deploymentId}`),

  getLogs: (deploymentId: string, since?: number) =>
    apiClient.get(`/api/logs/${deploymentId}`, { params: { since } }),

  getHealth: (deploymentId: string) =>
    apiClient.get(`/api/health/${deploymentId}`),

  getMetrics: (deploymentId: string) =>
    apiClient.get(`/api/metrics/${deploymentId}`),
};



