import axios from 'axios';
import type { Employee } from '../../types';

const API_BASE_URL = 'http://localhost:3000/employees';

export const getEmployees = async (params?: any): Promise<{ items: Employee[]; total: number }> => {
  const res = await axios.get(API_BASE_URL, { params });
  return res.data;
};

export const getEmployeeById = async (id: string): Promise<Employee> => {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
};

export const createEmployee = async (data: Partial<Employee>): Promise<Employee> => {
  const res = await axios.post(API_BASE_URL, data);
  return res.data;
};

export const updateEmployee = async (id: string, data: Partial<Employee>): Promise<Employee> => {
  const res = await axios.patch(`${API_BASE_URL}/${id}`, data);
  return res.data;
};

export const deleteEmployee = async (id: string) => {
  await axios.delete(`${API_BASE_URL}/${id}`);
};
