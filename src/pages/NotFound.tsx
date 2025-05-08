import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import Button from '../components/Button';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <h1 className="text-9xl font-extrabold text-gray-200">404</h1>
      <div className="absolute top-1/2 -translate-y-1/2 border-8 border-gray-100 rounded-full p-4 bg-white">
        <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </div>
      <div className="mt-24">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Página No Encontrada</h2>
        <p className="text-gray-600 mb-8">
          La página que estás buscando no existe o ha sido movida.
        </p>
        <Button 
          variant="primary"
          icon={<Home className="h-4 w-4" />}
          onClick={() => navigate('/')}
        >
          Volver al Inicio
        </Button>
      </div>
    </div>
  );
};

export default NotFound;