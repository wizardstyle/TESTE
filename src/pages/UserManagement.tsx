import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { UserRole, UserCreateDTO, User } from '../types/User';

export const UserManagement: React.FC = () => {
    const { users, addUser, updateUser, deleteUser } = useUser();
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<UserCreateDTO>({
        username: '',
        email: '',
        password: '',
        role: 'technician',
        firstName: '',
        lastName: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedUser) {
            await updateUser(selectedUser.id, {
                username: formData.username,
                email: formData.email,
                role: formData.role as UserRole,
                firstName: formData.firstName,
                lastName: formData.lastName,
            });
            setSelectedUser(null);
        } else {
            await addUser(formData);
        }
        setFormData({
            username: '',
            email: '',
            password: '',
            role: 'technician',
            firstName: '',
            lastName: '',
        });
    };

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setFormData({
            username: user.username,
            email: user.email,
            password: '', // No mostramos la contraseña existente
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
        });
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('¿Está seguro de que desea eliminar este usuario?')) {
            await deleteUser(id);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Gestión de Usuarios</h1>
            
            <form onSubmit={handleSubmit} className="mb-8 space-y-4 max-w-md">
                <div>
                    <label className="block text-sm font-medium mb-1">Nombre de Usuario</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium mb-1">Correo Electrónico</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                
                {!selectedUser && (
                    <div>
                        <label className="block text-sm font-medium mb-1">Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                )}
                
                <div>
                    <label className="block text-sm font-medium mb-1">Rol</label>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                    >
                        <option value="admin">Administrador</option>
                        <option value="manager">Gerente</option>
                        <option value="technician">Técnico</option>
                        <option value="receptionist">Recepcionista</option>
                    </select>
                </div>
                
                <div>
                    <label className="block text-sm font-medium mb-1">Nombre</label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium mb-1">Apellido</label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    {selectedUser ? 'Actualizar Usuario' : 'Crear Usuario'}
                </button>
                
                {selectedUser && (
                    <button
                        type="button"
                        onClick={() => {
                            setSelectedUser(null);
                            setFormData({
                                username: '',
                                email: '',
                                password: '',
                                role: 'technician',
                                firstName: '',
                                lastName: '',
                            });
                        }}
                        className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 mt-2"
                    >
                        Cancelar Edición
                    </button>
                )}
            </form>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border">Usuario</th>
                            <th className="py-2 px-4 border">Correo</th>
                            <th className="py-2 px-4 border">Rol</th>
                            <th className="py-2 px-4 border">Nombre Completo</th>
                            <th className="py-2 px-4 border">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td className="py-2 px-4 border">{user.username}</td>
                                <td className="py-2 px-4 border">{user.email}</td>
                                <td className="py-2 px-4 border">{user.role}</td>
                                <td className="py-2 px-4 border">{`${user.firstName} ${user.lastName}`}</td>
                                <td className="py-2 px-4 border">
                                    <button
                                        onClick={() => handleEdit(user)}
                                        className="bg-yellow-500 text-white py-1 px-2 rounded mr-2 hover:bg-yellow-600"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}; 