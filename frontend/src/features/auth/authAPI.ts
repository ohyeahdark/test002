import api from '../../api/axios';

const API_BASE_URL = 'http://localhost:3000/auth';

export const logout = async () => {
  const res = await api.post(API_BASE_URL + '/logout', {}, { withCredentials: true });
  return res.data;
};

export const login = async (username: string, password: string) => {
  const res = await api.post('/auth/login', { username, password });
  console.log(res.data);
  return res.data;
};

export const fetchMe = async () => {
  const res = await api.get('/auth/me');
  return res.data;
};

export const register = async (username: string, password: string) => {
  const res = await api.post('/auth/register', { username, password });
  return res.data; // { accessToken, user }
};

export const refresh = async () => {
  const res = await api.post('/auth/refresh');
  return res.data;
};