import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Wrench, Plus, Settings } from 'lucide-react';

const Sidebar: React.FC = () => {
  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-gray-200 bg-white">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">LumoraFix</h1>
        <p className="text-sm text-gray-500">Sistema de Gestión de Reparaciones</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
              isActive 
                ? 'bg-blue-50 text-blue-700' 
                : 'text-gray-700 hover:bg-gray-100'
            }`
          }
          end
        >
          <LayoutDashboard className="w-5 h-5 mr-3" />
          Panel de Control
        </NavLink>
        <NavLink 
          to="/repairs" 
          className={({ isActive }) => 
            `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
              isActive 
                ? 'bg-blue-50 text-blue-700' 
                : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <Wrench className="w-5 h-5 mr-3" />
          Reparaciones
        </NavLink>
        <NavLink 
          to="/repairs/new" 
          className={({ isActive }) => 
            `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
              isActive 
                ? 'bg-blue-50 text-blue-700' 
                : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <Plus className="w-5 h-5 mr-3" />
          Nueva Reparación
        </NavLink>
        <NavLink 
          to="/settings" 
          className={({ isActive }) => 
            `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
              isActive 
                ? 'bg-blue-50 text-blue-700' 
                : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <Settings className="w-5 h-5 mr-3" />
          Configuración
        </NavLink>
      </nav>
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
            <span className="text-sm font-medium">LF</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">Sonimag</p>
            <p className="text-xs text-gray-500">Administrador</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;