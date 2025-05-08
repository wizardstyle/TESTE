import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  ArrowLeft, Edit, Trash2, Printer, Clock, CheckCircle, 
  Calendar, AlertTriangle, User, Phone, Mail, MapPin, Tag,
  Truck, MessageCircle, Plus
} from 'lucide-react';
import { useRepairs } from '../context/RepairContext';
import Button from '../components/Button';
import Card from '../components/Card';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';
import WarrantyBadge from '../components/WarrantyBadge';
import PrintTicketModal from '../components/PrintTicketModal';
import StatusChangeModal from '../components/StatusChangeModal';
import type { Repair } from '../types/repair';
import { sendRepairReadyEmail } from '../utils/emailService';
import { useToast } from '../context/ToastContext';

const RepairDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRepairById, deleteRepair, markDelivered, updateRepair, markSupplierDelivered } = useRepairs();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isMarkDeliveredModalOpen, setIsMarkDeliveredModalOpen] = useState(false);
  const [isPrintTicketModalOpen, setIsPrintTicketModalOpen] = useState(false);
  const [isStatusChangeModalOpen, setIsStatusChangeModalOpen] = useState(false);
  const [isMarkSupplierDeliveredModalOpen, setIsMarkSupplierDeliveredModalOpen] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState(new Date().toISOString().slice(0, 10));
  const { showToast } = useToast();
  const [contactNote, setContactNote] = useState('');
  const [isAddContactNoteOpen, setIsAddContactNoteOpen] = useState(false);
  
  const repair = id ? getRepairById(id) : undefined;
  
  if (!repair) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <AlertTriangle className="h-16 w-16 text-yellow-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Reparación no encontrada</h2>
        <p className="text-gray-600 mb-6">La reparación que estás buscando no existe o ha sido eliminada.</p>
        <Button 
          variant="primary"
          onClick={() => navigate('/repairs')}
        >
          Volver a Reparaciones
        </Button>
      </div>
    );
  }

  const handleDelete = () => {
    deleteRepair(repair.id);
    setIsDeleteModalOpen(false);
    navigate('/repairs');
  };

  const handleMarkDelivered = () => {
    markDelivered(repair.id, deliveryDate);
    setIsMarkDeliveredModalOpen(false);
  };

  const handleMarkSupplierDelivered = async () => {
    if (repair) {
      const today = new Date().toISOString().slice(0, 10);
      const note = `Reparado en tienda el ${format(new Date(), 'dd/MM/yyyy')}`;
      
      // Update repair with supplier delivery status, date and note
      updateRepair(repair.id, {
        status: 'supplier_delivered',
        deliveryDate: today,
        notes: repair.notes ? `${repair.notes}\n${note}` : note
      });
      
      // Enviar email al cliente
      if (repair.client.email) {
        const emailSent = await sendRepairReadyEmail(repair);
        if (emailSent) {
          // Mostrar notificación de éxito
          showToast(
            'success',
            'Email enviado',
            `Se ha notificado a ${repair.client.name} que su reparación está lista.`
          );
        } else {
          // Mostrar notificación de error
          showToast(
            'error',
            'Error al enviar email',
            'No se pudo enviar la notificación por email al cliente.'
          );
        }
      }
      
      setIsMarkSupplierDeliveredModalOpen(false);
    }
  };

  const handleStatusChange = (status: Repair['status']) => {
    updateRepair(repair.id, { status });
  };

  const handleAddContactNote = () => {
    if (repair && contactNote.trim()) {
      const note = `[${format(new Date(), 'dd/MM/yyyy HH:mm')}] ${contactNote.trim()}`;
      updateRepair(repair.id, {
        notes: repair.notes ? `${repair.notes}\n${note}` : note
      });
      setContactNote('');
      setIsAddContactNoteOpen(false);
      showToast(
        'success',
        'Nota añadida',
        'Se ha registrado el contacto con el cliente.'
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button 
            className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Reparar #{repair.repairNumber}
            </h2>
            <p className="text-sm text-gray-500">
              Creado el {format(new Date(repair.date), 'MMMM d, yyyy')}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            icon={<Printer className="h-4 w-4" />}
            onClick={() => setIsPrintTicketModalOpen(true)}
          >
            Imprimir ticket
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            icon={<Edit className="h-4 w-4" />}
            onClick={() => navigate(`/repairs/${repair.id}/edit`)}
          >
            Editar
          </Button>
          
          <Button
            variant="danger"
            size="sm"
            icon={<Trash2 className="h-4 w-4" />}
            onClick={() => setIsDeleteModalOpen(true)}
          >
            Borrar
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <div className="flex justify-between mb-6">
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsStatusChangeModalOpen(true)}
                  className="hover:bg-gray-50 p-1 rounded transition-colors"
                >
                  <StatusBadge status={repair.status} className="text-sm px-3 py-1" />
                </button>
                <WarrantyBadge warranty={repair.warranty} className="text-sm px-3 py-1" />
                {repair.requestBudget && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    Presupuesto solicitado
                  </span>
                )}
              </div>
              
              <div className="flex space-x-2">
                {repair.status !== 'completed' && repair.status !== 'supplier_delivered' && (
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<Truck className="h-4 w-4" />}
                    onClick={() => setIsMarkSupplierDeliveredModalOpen(true)}
                  >
                    Reparado en tienda
                  </Button>
                )}
                
                {repair.status !== 'completed' && (
                  <Button
                    variant="success"
                    size="sm"
                    icon={<CheckCircle className="h-4 w-4" />}
                    onClick={() => setIsMarkDeliveredModalOpen(true)}
                  >
                    Entregue al cliente
                  </Button>
                )}
              </div>
            </div>
            
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:space-x-8">
                <div className="mb-4 sm:mb-0">
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Artículo</h4>
                  <p className="text-base font-medium text-gray-900">{repair.article}</p>
                </div>
                
                <div className="mb-4 sm:mb-0">
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Marca</h4>
                  <p className="text-base font-medium text-gray-900">{repair.brand}</p>
                </div>
                
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Modelo</h4>
                  <p className="text-base font-medium text-gray-900">{repair.model}</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:space-x-8">
                <div className="mb-4 sm:mb-0">
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Serial/IMEI</h4>
                  <p className="text-base font-medium text-gray-900">{repair.serialImei || 'N/A'}</p>
                </div>
                
                <div className="mb-4 sm:mb-0">
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Código</h4>
                  <p className="text-base font-medium text-gray-900">{repair.code || 'N/A'}</p>
                </div>
                
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Proveedor</h4>
                  <p className="text-base font-medium text-gray-900">{repair.provider || 'N/A'}</p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Contenido</h4>
                <p className="text-sm text-gray-700">{repair.content || 'No content information provided'}</p>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Problem Description</h4>
                <p className="text-sm text-gray-700">{repair.problem}</p>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:space-x-8 border-t border-gray-200 pt-4">
                <div className="mb-4 sm:mb-0">
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Recibido por</h4>
                  <p className="text-base font-medium text-gray-900">{repair.receivedBy}</p>
                </div>
                
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    {repair.deliveryDate ? 'ENTREGUE POR EL PROVEEDOR' : 'ENTREGUE POR EL PROVEEDOR'}
                  </h4>
                  {repair.deliveryDate ? (
                    <p className="text-base font-medium text-green-600">
                      {format(new Date(repair.deliveryDate), 'MMMM d, yyyy')}
                    </p>
                  ) : (
                    <p className="text-base font-medium text-yellow-600">Aún no entregado</p>
                  )}
                </div>
              </div>
            </div>
          </Card>
          
          <Card title="Cronograma de reparación">
            <div className="space-y-6">
              <div className="relative pl-8 before:absolute before:left-3 before:top-1 before:bottom-0 before:w-px before:bg-gray-200">
                <div className="absolute left-0 top-1 flex items-center justify-center w-6 h-6 rounded-full bg-blue-100">
                  <Calendar className="h-3 w-3 text-blue-600" />
                </div>
                <h4 className="text-sm font-medium text-gray-900">Reparación creada</h4>
                <p className="text-xs text-gray-500 mt-1">
                  {format(new Date(repair.date), 'MMMM d, yyyy')} por {repair.receivedBy}
                </p>
              </div>

              {repair.status === 'pending' && (
                <div className="relative pl-8 before:absolute before:left-3 before:top-1 before:bottom-0 before:w-px before:bg-gray-200">
                  <div className="absolute left-0 top-1 flex items-center justify-center w-6 h-6 rounded-full bg-yellow-100">
                    <Clock className="h-3 w-3 text-yellow-600" />
                  </div>
                  <h4 className="text-sm font-medium text-gray-900">Pendiente</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Esperando procesamiento
                  </p>
                </div>
              )}

              {repair.status === 'in_progress' && (
                <div className="relative pl-8 before:absolute before:left-3 before:top-1 before:bottom-0 before:w-px before:bg-gray-200">
                  <div className="absolute left-0 top-1 flex items-center justify-center w-6 h-6 rounded-full bg-blue-100">
                    <Clock className="h-3 w-3 text-blue-600" />
                  </div>
                  <h4 className="text-sm font-medium text-gray-900">En Proceso</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Reparación en curso
                  </p>
                </div>
              )}

              {repair.status === 'supplier_delivered' && (
                <div className="relative pl-8 before:absolute before:left-3 before:top-1 before:bottom-0 before:w-px before:bg-gray-200">
                  <div className="absolute left-0 top-1 flex items-center justify-center w-6 h-6 rounded-full bg-purple-100">
                    <Truck className="h-3 w-3 text-purple-600" />
                  </div>
                  <h4 className="text-sm font-medium text-gray-900">Reparado en tienda</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Reparación completada en tienda
                  </p>
                </div>
              )}

              {repair.notes && repair.notes.split('\n').map((note, index) => {
                const dateMatch = note.match(/\[([\d/: ]+)\]/);
                return (
                  <div key={`note-${index}`} className="relative pl-8 before:absolute before:left-3 before:top-1 before:bottom-0 before:w-px before:bg-gray-200">
                    <div className="absolute left-0 top-1 flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100">
                      <MessageCircle className="h-3 w-3 text-indigo-600" />
                    </div>
                    <h4 className="text-sm font-medium text-gray-900">Contacto con Cliente</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {dateMatch ? dateMatch[1] : 'Fecha no disponible'}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                      {note.replace(/\[[\d/: ]+\] /, '')}
                    </p>
                  </div>
                );
              })}

              {repair.status === 'completed' && (
                <div className="relative pl-8">
                  <div className="absolute left-0 top-1 flex items-center justify-center w-6 h-6 rounded-full bg-green-100">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                  </div>
                  <h4 className="text-sm font-medium text-gray-900">Completado</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {repair.deliveryDate ? format(new Date(repair.deliveryDate), 'MMMM d, yyyy') : 'Fecha no disponible'}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
        
        <div className="md:col-span-1 space-y-6">
          <Card title="Información del cliente">
            <div className="space-y-4">
              <div className="flex items-start">
                <User className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    {repair.client.name} {repair.client.surname}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">Cliente</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{repair.client.phone}</h4>
                  <p className="text-xs text-gray-500 mt-1">Telf</p>
                </div>
              </div>
              
              {repair.client.email && (
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{repair.client.email}</h4>
                    <p className="text-xs text-gray-500 mt-1">Email</p>
                  </div>
                </div>
              )}
              
              {repair.client.ticketNumber && (
                <div className="flex items-start">
                  <Tag className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{repair.client.ticketNumber}</h4>
                    <p className="text-xs text-gray-500 mt-1">Número Ticket</p>
                  </div>
                </div>
              )}
              
              {repair.client.address && (
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{repair.client.address}</h4>
                    <p className="text-xs text-gray-500 mt-1">DIRECCIÓN</p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card title="Registro de Contacto con Cliente">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-900">Historial de contactos</h3>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Plus className="h-4 w-4" />}
                  onClick={() => setIsAddContactNoteOpen(true)}
                >
                  Añadir contacto
                </Button>
              </div>
              
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {repair.notes ? (
                  repair.notes.split('\n').map((note, index) => (
                    <div key={index} className="text-sm text-gray-600 border-l-2 border-blue-500 pl-3">
                      {note}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">No hay registros de contacto</p>
                )}
              </div>
            </div>
          </Card>
          
          <Card title="Repair Notes">
            <div className="text-sm text-gray-600">
              <p className="mb-4">El tiempo estimado para la gestión de garantía/reparación es de 15 a 90 días.</p>
              {repair.warranty && (
                <div className="p-3 bg-purple-50 rounded-md border border-purple-100 mb-4">
                  <h4 className="text-sm font-medium text-purple-900 mb-1">Información de garantía</h4>
                  <p className="text-xs text-purple-700">
                    Esta reparación está cubierta por la garantía. Se aplican procedimientos de manejo especiales.
                  </p>
                </div>
              )}
              {repair.requestBudget && (
                <div className="p-3 bg-orange-50 rounded-md border border-orange-100 mb-4">
                  <h4 className="text-sm font-medium text-orange-900 mb-1">Solicitud de presupuesto</h4>
                  <p className="text-xs text-orange-700">
                    El cliente ha solicitado un presupuesto antes de proceder a la reparación.
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
      
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
      >
        <div className="py-3">
          <p className="text-gray-700">
            ¿Está seguro de que desea eliminar esta reparación? Esta acción no se puede deshacer.
          </p>
        </div>
        <div className="flex justify-end space-x-3 mt-4">
          <Button
            variant="outline"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
          >
            Borrar
          </Button>
        </div>
      </Modal>
      
      <Modal
        isOpen={isMarkDeliveredModalOpen}
        onClose={() => setIsMarkDeliveredModalOpen(false)}
        title="Entregue al cliente"
      >
        <div className="py-3">
          <p className="text-gray-700 mb-4">
            Introduzca la fecha de entrega para esta reparación:
          </p>
          <input
            type="date"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex justify-end space-x-3 mt-4">
          <Button
            variant="outline"
            onClick={() => setIsMarkDeliveredModalOpen(false)}
          >
            Cancelar
          </Button>
          <Button
            variant="success"
            onClick={handleMarkDelivered}
          >
            Confirmar entrega
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={isMarkSupplierDeliveredModalOpen}
        onClose={() => setIsMarkSupplierDeliveredModalOpen(false)}
        title="Reparado en tienda"
      >
        <div className="py-3">
          <p className="text-gray-700">
            ¿Está seguro de que desea marcar esta reparación como reparada en tienda?
          </p>
        </div>
        <div className="flex justify-end space-x-3 mt-4">
          <Button
            variant="outline"
            onClick={() => setIsMarkSupplierDeliveredModalOpen(false)}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleMarkSupplierDelivered}
          >
            Confirmar
          </Button>
        </div>
      </Modal>

      <PrintTicketModal
        isOpen={isPrintTicketModalOpen}
        onClose={() => setIsPrintTicketModalOpen(false)}
        repair={repair}
      />

      <StatusChangeModal
        isOpen={isStatusChangeModalOpen}
        onClose={() => setIsStatusChangeModalOpen(false)}
        repair={repair}
        onStatusChange={handleStatusChange}
      />

      <Modal
        isOpen={isAddContactNoteOpen}
        onClose={() => setIsAddContactNoteOpen(false)}
        title="Registrar contacto con cliente"
      >
        <div className="py-3">
          <p className="text-gray-700 mb-4">
            Ingrese los detalles del contacto con el cliente:
          </p>
          <textarea
            value={contactNote}
            onChange={(e) => setContactNote(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 h-32"
            placeholder="Ej: Se llamó al cliente para informar sobre el estado de la reparación..."
          />
        </div>
        <div className="flex justify-end space-x-3 mt-4">
          <Button
            variant="outline"
            onClick={() => {
              setContactNote('');
              setIsAddContactNoteOpen(false);
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleAddContactNote}
            disabled={!contactNote.trim()}
          >
            Guardar nota
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default RepairDetails;