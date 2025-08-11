import axios from 'axios';
import type { Department } from '../../types';

const API_BASE_URL = 'http://localhost:3000/departments';

export const getDepartments = async (params?: any): Promise<{ items: Department[]; total: number }> => {
    const response = await axios.get(API_BASE_URL, { params });
    return response.data;
};

export const getDepartmentById = async (id: string): Promise<Department> => {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
};

export const createDepartment = async (data: Partial<Department>): Promise<Department> => {
    const response = await axios.post(API_BASE_URL, data);
    return response.data;
};

export const updateDepartment = async (id: string, data: Partial<Department>): Promise<Department> => {
    const response = await axios.patch(`${API_BASE_URL}/${id}`, data);
    return response.data;
};

export const deleteDepartment = async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/${id}`);
};
