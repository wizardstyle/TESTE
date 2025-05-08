import React, { useState } from 'react';
import { Printer } from 'lucide-react';
import { Repair } from '../types';
import { TicketPrinter } from '../utils/ticketPrinter';
import Modal from './Modal';
import Button from './Button';

interface PrintTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  repair: Repair;
}

const PrintTicketModal: React.FC<PrintTicketModalProps> = ({
  isOpen,
  onClose,
  repair
}) => {
  const [isPrinting, setIsPrinting] = useState(false);
  const [previewContent, setPreviewContent] = useState('');

  const handlePreview = () => {
    const content = TicketPrinter.generateTicketContent(repair);
    setPreviewContent(content);
  };

  const handlePrint = async () => {
    try {
      setIsPrinting(true);
      await TicketPrinter.printTicket(repair);
      onClose();
    } catch (error) {
      console.error('Error de impresión:', error);
      alert('Error al imprimir el ticket. Por favor, inténtelo de nuevo.');
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Imprimir Ticket de Reparación"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Imprimir ticket para la reparación #{repair.repairNumber}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreview}
          >
            Vista Previa
          </Button>
        </div>

        {previewContent && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <pre className="text-xs font-mono whitespace-pre-wrap overflow-x-auto">
              {previewContent}
            </pre>
          </div>
        )}

        <div className="flex justify-end space-x-3 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            icon={<Printer className="h-4 w-4" />}
            onClick={handlePrint}
            disabled={isPrinting}
          >
            {isPrinting ? 'Imprimiendo...' : 'Imprimir Ticket'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PrintTicketModal;