import React from 'react';
import { AlertCircle } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';
import { Repair } from '../types';

interface StatusChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  repair: Repair;
  onStatusChange: (status: Repair['status']) => void;
}

const StatusChangeModal: React.FC<StatusChangeModalProps> = ({
  isOpen,
  onClose,
  repair,
  onStatusChange
}) => {
  const statuses: Repair['status'][] = ['pending', 'in_progress', 'supplier_delivered', 'completed'];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cambiar Estado de Reparación"
    >
      <div className="space-y-4">
        <div className="bg-yellow-50 border border-yellow-100 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Nota Importante
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                Cambiar el estado actualizará el progreso de la reparación. Asegúrese de que esta es la acción deseada.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => {
                onStatusChange(status);
                onClose();
              }}
              className={`flex items-center justify-between p-4 rounded-lg border ${
                repair.status === status
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-3 ${
                  status === 'pending' ? 'bg-yellow-500' :
                  status === 'in_progress' ? 'bg-blue-500' :
                  status === 'supplier_delivered' ? 'bg-purple-500' :
                  'bg-green-500'
                }`} />
                <span className={`font-medium ${
                  repair.status === status ? 'text-blue-900' : 'text-gray-900'
                }`}>
                  {status === 'pending' ? 'Pendiente' :
                   status === 'in_progress' ? 'En Proceso' :
                   status === 'supplier_delivered' ? 'Reparado en tienda' :
                   'Completado'}
                </span>
              </div>
              {repair.status === status && (
                <span className="text-blue-600 text-sm">Estado Actual</span>
              )}
            </button>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancelar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default StatusChangeModal;