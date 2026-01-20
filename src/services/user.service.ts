import api from './api';
import type { User } from '../types/user.type';

export const userService = {
  async getAllUsers(): Promise<User[]> {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  async getUserById(id: string): Promise<User> {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  async createUser(user: Omit<User, 'id'>): Promise<User> {
    const response = await api.post<User>('/users', user);
    return response.data;
  },

  async updateUser(id: string, user: Partial<User>): Promise<User> {
    const response = await api.put<User>(`/users/${id}`, user);
    return response.data;
  },

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  }
};
