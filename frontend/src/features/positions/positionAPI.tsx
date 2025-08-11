import axios from 'axios';
import type { Position } from '../../types';

const API_BASE_URL = 'http://localhost:3000/positions';

export const getPositions = async (params?: any): Promise<{ items: Position[]; total: number }> => {
  const res = await axios.get(API_BASE_URL, { params });
  return res.data;
};

export const getPositionById = async (id: string): Promise<Position> => {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
};

export const createPosition = async (data: Partial<Position>): Promise<Position>  => {
  const res = await axios.post(API_BASE_URL, data);
  return res.data;
};

export const updatePosition = async (id: string, data: Partial<Position>): Promise<Position> => {
  const res = await axios.patch(`${API_BASE_URL}/${id}`, data);
  return res.data;
};

export const deletePosition = async (id: string) => {
  await axios.delete(`${API_BASE_URL}/${id}`);
};
