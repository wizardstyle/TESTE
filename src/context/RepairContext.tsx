import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Repair } from '../types/repair';
import type { RepairFormData } from '../types';
import { format } from 'date-fns';
import { BackupService } from '../utils/backupService';

type RepairAction = 
  | { type: 'ADD_REPAIR'; payload: RepairFormData }
  | { type: 'UPDATE_REPAIR'; payload: { id: string; data: Partial<Repair> } }
  | { type: 'DELETE_REPAIR'; payload: string }
  | { type: 'MARK_DELIVERED'; payload: { id: string; deliveryDate: string } }
  | { type: 'MARK_SUPPLIER_DELIVERED'; payload: string }
  | { type: 'SET_REPAIRS'; payload: Repair[] };

interface RepairContextType {
  repairs: Repair[];
  loading: boolean;
  error: string | null;
  addRepair: (data: RepairFormData) => void;
  updateRepair: (id: string, data: Partial<Repair>) => void;
  deleteRepair: (id: string) => void;
  markDelivered: (id: string, deliveryDate: string) => void;
  markSupplierDelivered: (id: string) => void;
  getRepairById: (id: string) => Repair | undefined;
  getNextRepairNumber: () => string;
}

const mockRepairs: Repair[] = [
  {
    id: '1',
    date: '2025-06-01',
    repairNumber: 'REP001',
    receivedBy: 'John Doe',
    warranty: true,
    code: 'LT001',
    article: 'Laptop',
    brand: 'Dell',
    model: 'XPS 15',
    serialImei: 'DL1234567890',
    provider: 'Dell Inc',
    requestBudget: false,
    content: 'Laptop with charger',
    problem: 'Does not turn on',
    deliveryDate: null,
    client: {
      name: 'Jane',
      surname: 'Smith',
      phone: '555-123-4567',
      ticketNumber: 'TK001',
      email: 'jane@example.com',
      address: '123 Main St, City'
    },
    status: 'in_progress'
  },
  {
    id: '2',
    date: '2025-06-02',
    repairNumber: 'REP002',
    receivedBy: 'Maria Lopez',
    warranty: false,
    code: 'PH002',
    article: 'Smartphone',
    brand: 'Samsung',
    model: 'Galaxy S22',
    serialImei: 'SM789012345',
    provider: 'Samsung Electronics',
    requestBudget: true,
    content: 'Phone with case',
    problem: 'Cracked screen',
    deliveryDate: null,
    client: {
      name: 'Robert',
      surname: 'Johnson',
      phone: '555-987-6543',
      ticketNumber: 'TK002',
      email: 'robert@example.com',
      address: '456 Oak Ave, Town'
    },
    status: 'pending'
  }
];

const initialState = {
  repairs: [],
  loading: true,
  error: null
};

function repairReducer(state, action: RepairAction) {
  let newState;
  
  switch (action.type) {
    case 'ADD_REPAIR':
      newState = {
        ...state,
        repairs: [...state.repairs, {
          ...action.payload,
          id: uuidv4(),
          date: format(new Date(), 'yyyy-MM-dd'),
          repairNumber: `REP${(state.repairs.length + 1).toString().padStart(3, '0')}`,
          status: 'pending'
        }]
      };
      break;
    case 'UPDATE_REPAIR':
      newState = {
        ...state,
        repairs: state.repairs.map(repair =>
          repair.id === action.payload.id
            ? { ...repair, ...action.payload.data }
            : repair
        )
      };
      break;
    case 'DELETE_REPAIR':
      newState = {
        ...state,
        repairs: state.repairs.filter(repair => repair.id !== action.payload)
      };
      break;
    case 'MARK_DELIVERED':
      newState = {
        ...state,
        repairs: state.repairs.map(repair =>
          repair.id === action.payload.id
            ? { ...repair, deliveryDate: action.payload.deliveryDate, status: 'completed' }
            : repair
        )
      };
      break;
    case 'MARK_SUPPLIER_DELIVERED':
      newState = {
        ...state,
        repairs: state.repairs.map(repair =>
          repair.id === action.payload
            ? { ...repair, status: 'supplier_delivered' }
            : repair
        )
      };
      break;
    case 'SET_REPAIRS':
      newState = {
        ...state,
        repairs: action.payload,
        loading: false
      };
      break;
    default:
      return state;
  }

  // Perform backup after state changes
  BackupService.performBackup(newState.repairs);
  return newState;
}

const RepairContext = createContext<RepairContextType | undefined>(undefined);

export const RepairProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(repairReducer, initialState);

  useEffect(() => {
    // In a real app, we would fetch from API or localStorage
    dispatch({ type: 'SET_REPAIRS', payload: mockRepairs });
  }, []);

  // Save to localStorage when repairs change
  useEffect(() => {
    if (!state.loading) {
      localStorage.setItem('repairs', JSON.stringify(state.repairs));
    }
  }, [state.repairs, state.loading]);

  const addRepair = (data: RepairFormData) => {
    dispatch({ type: 'ADD_REPAIR', payload: data });
  };

  const updateRepair = (id: string, data: Partial<Repair>) => {
    dispatch({ type: 'UPDATE_REPAIR', payload: { id, data } });
  };

  const deleteRepair = (id: string) => {
    dispatch({ type: 'DELETE_REPAIR', payload: id });
  };

  const markDelivered = (id: string, deliveryDate: string) => {
    dispatch({ type: 'MARK_DELIVERED', payload: { id, deliveryDate } });
  };

  const markSupplierDelivered = (id: string) => {
    dispatch({ type: 'MARK_SUPPLIER_DELIVERED', payload: id });
  };

  const getRepairById = (id: string) => {
    return state.repairs.find(repair => repair.id === id);
  };

  const getNextRepairNumber = () => {
    return `REP${(state.repairs.length + 1).toString().padStart(3, '0')}`;
  };

  return (
    <RepairContext.Provider value={{
      ...state,
      addRepair,
      updateRepair,
      deleteRepair,
      markDelivered,
      markSupplierDelivered,
      getRepairById,
      getNextRepairNumber
    }}>
      {children}
    </RepairContext.Provider>
  );
};

export const useRepairs = () => {
  const context = useContext(RepairContext);
  if (context === undefined) {
    throw new Error('useRepairs must be used within a RepairProvider');
  }
  return context;
};