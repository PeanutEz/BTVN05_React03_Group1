import api from './api';
import type { User, LoginRequest, LoginResponse, RegisterRequest } from '../types/user.type';

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

  async register(data: RegisterRequest): Promise<void> {
    try {
      // Check if email exists
      let emailExists = false;
      try {
        const checkResponse = await api.get<User[]>(`/users?email=${data.email}`);
        if (checkResponse.data && checkResponse.data.length > 0) {
          emailExists = true;
        }
      } catch (error: any) {
        if (error.response?.status !== 404) {
          throw error;
        }
      }

      if (emailExists) {
        throw new Error('Email đã tồn tại');
      }

      const now = new Date().toISOString();
      const newUser = {
        ...data,
        createDate: now,
        updateDate: now,
        role: 'User',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=random`
      };

      await api.post('/users', newUser);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Đăng ký thất bại');
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
