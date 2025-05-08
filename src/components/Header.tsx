import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Search, ChevronDown, X, Menu as MenuIcon, LogOut } from 'lucide-react';
import useAuthStore from '../store/authStore';
import NotificationPopover from './NotificationPopover';

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { username, logout } = useAuthStore();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Panel de Control';
    if (path === '/repairs') return 'Reparaciones';
    if (path === '/repairs/new') return 'Nueva Reparación';
    if (path.match(/\/repairs\/.*\/edit/)) return 'Editar Reparación';
    if (path.match(/\/repairs\/.*/)) return 'Detalles de Reparación';
    return 'Gestión de Reparaciones';
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/repairs?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        <div className="flex items-center">
          <button 
            className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <MenuIcon className="h-6 w-6" />
          </button>
          <h1 className="ml-2 md:ml-0 text-xl font-semibold text-gray-800">{getPageTitle()}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {isSearchOpen ? (
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Buscar reparaciones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm pl-10 pr-12 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                autoFocus
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <button 
                type="button" 
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setIsSearchOpen(false)}
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </form>
          ) : (
            <button 
              className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </button>
          )}
          
          <NotificationPopover />
          
          <div className="relative">
            <button 
              className="flex items-center space-x-2 focus:outline-none group"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                <span className="text-sm font-medium">{username?.slice(0, 2).toUpperCase()}</span>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-500 group-hover:text-gray-700" />
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white py-2">
          <nav className="px-4 py-2 space-y-1">
            <a href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">
              Panel de Control
            </a>
            <a href="/repairs" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">
              Reparaciones
            </a>
            <a href="/repairs/new" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">
              Nueva Reparación
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;