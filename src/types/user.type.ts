export interface User {
    id: string,
    name: string,
    email: string,
    password?: string,
    createDate: string,
    updateDate?: string,
    role: string,
    avatar?: string
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    user: User;
    message: string;
}