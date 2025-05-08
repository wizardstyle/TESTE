import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { RepairProvider } from './context/RepairContext';
import { ToastProvider } from './context/ToastContext';
import { UserProvider } from './context/UserContext';
import AppRoutes from './routes';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <RepairProvider>
        <ToastProvider>
          <UserProvider>
            <AppRoutes />
          </UserProvider>
        </ToastProvider>
      </RepairProvider>
    </BrowserRouter>
  );
};

export default App;