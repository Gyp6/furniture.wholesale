import axios from 'axios';

const isServer = typeof window === 'undefined';

export const API_BASE_URL = isServer
  ? process.env.API_URL || 'http://backend:4200'
  : process.env.NEXT_PUBLIC_API_URL || '/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});
