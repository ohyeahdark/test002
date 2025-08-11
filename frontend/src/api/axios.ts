// src/api/axios.ts
import axios from 'axios';
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
  // withCredentials: false // bearer token flow không cần
});
export default api;
