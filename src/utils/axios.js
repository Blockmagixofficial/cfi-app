import axios from 'axios';
import { generateHMAC } from './utils';

const axiosInstance = axios.create({
  baseURL: 'https://backend.gamocrat.com', // Set your base URL here
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const { hmac, nonce, timestamp } = await generateHMAC();
      
      // Get token from localStorage
      const token = localStorage.getItem("token");
      
      // Set headers for HMAC and token
      config.headers['x-hmac-signature'] = hmac;
      config.headers['x-nonce'] = nonce;
      config.headers['x-timestamp'] = timestamp;
      
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`; // Add Bearer token
      }
    } catch (error) {
      console.error('Error generating HMAC:', error);
      throw error;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
