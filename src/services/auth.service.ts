import api from './api';
import type { User, LoginRequest, LoginResponse } from '../types/user.type';

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await api.get<User[]>(`/users?email=${credentials.email}`);
      const users = response.data;
      
      if (!users || users.length === 0) {
        throw new Error('Email hoặc mật khẩu không đúng');
      }
      
      const user = users[0];
      
      if (user.password !== credentials.password) {
        throw new Error('Email hoặc mật khẩu không đúng');
      }
      
      const { password, ...userWithoutPassword } = user;
      
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      return {
        user: userWithoutPassword,
        message: 'Đăng nhập thành công'
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Đăng nhập thất bại');
    }
  },
  
  logout(): void {
    localStorage.removeItem('user');
  },
  
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  }
};
