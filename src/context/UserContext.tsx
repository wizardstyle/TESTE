import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserCreateDTO, UserUpdateDTO } from '../types/User';

interface UserContextType {
    users: User[];
    currentUser: User | null;
    addUser: (user: UserCreateDTO) => Promise<void>;
    updateUser: (id: string, updates: UserUpdateDTO) => Promise<void>;
    deleteUser: (id: string) => Promise<void>;
    getUser: (id: string) => User | undefined;
    getAllUsers: () => User[];
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    // Cargar usuarios del localStorage al iniciar
    useEffect(() => {
        const storedUsers = localStorage.getItem('users');
        if (storedUsers) {
            setUsers(JSON.parse(storedUsers));
        }
    }, []);

    // Guardar usuarios en localStorage cuando cambien
    useEffect(() => {
        localStorage.setItem('users', JSON.stringify(users));
    }, [users]);

    const addUser = async (userData: UserCreateDTO) => {
        const newUser: User = {
            ...userData,
            id: crypto.randomUUID(),
            active: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        setUsers(prev => [...prev, newUser]);
    };

    const updateUser = async (id: string, updates: UserUpdateDTO) => {
        setUsers(prev => prev.map(user => 
            user.id === id 
                ? { ...user, ...updates, updatedAt: new Date() }
                : user
        ));
    };

    const deleteUser = async (id: string) => {
        setUsers(prev => prev.filter(user => user.id !== id));
    };

    const getUser = (id: string) => {
        return users.find(user => user.id === id);
    };

    const getAllUsers = () => {
        return users;
    };

    const value = {
        users,
        currentUser,
        addUser,
        updateUser,
        deleteUser,
        getUser,
        getAllUsers,
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}; 