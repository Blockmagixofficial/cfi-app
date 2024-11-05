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

      config.headers['x-hmac-signature'] = hmac;
      config.headers['x-nonce'] = nonce;
      config.headers['x-timestamp'] = timestamp;
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
