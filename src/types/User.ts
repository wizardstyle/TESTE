export type UserRole = 'admin' | 'manager' | 'technician' | 'receptionist';

export interface User {
    id: string;
    username: string;
    email: string;
    password: string; // This will be hashed
    role: UserRole;
    firstName: string;
    lastName: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserCreateDTO {
    username: string;
    email: string;
    password: string;
    role: UserRole;
    firstName: string;
    lastName: string;
}

export interface UserUpdateDTO {
    username?: string;
    email?: string;
    role?: UserRole;
    firstName?: string;
    lastName?: string;
    active?: boolean;
} 