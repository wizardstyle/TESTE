import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { useRepairs } from '../context/RepairContext';
import { RepairFormData } from '../types';
import Button from '../components/Button';
import Card from '../components/Card';

const RepairForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addRepair, updateRepair, getRepairById, getNextRepairNumber } = useRepairs();
  const [isEditMode, setIsEditMode] = useState(false);
  const [nextRepairNumber, setNextRepairNumber] = useState('');
  
  const defaultValues: RepairFormData = {
    receivedBy: '',
    warranty: false,
    code: '',
    article: '',
    brand: '',
    model: '',
    serialImei: '',
    provider: '',
    requestBudget: false,
    content: '',
    problem: '',
    deliveryDate: null,
    client: {
      name: '',
      surname: '',
      phone: '',
      ticketNumber: '',
      email: '',
      address: ''
    }
  };
  
  const { control, handleSubmit, reset, formState: { errors, isDirty } } = useForm<RepairFormData>({
    defaultValues
  });
  
  useEffect(() => {
    if (id) {
      const repair = getRepairById(id);
      if (repair) {
        setIsEditMode(true);
        const formData: RepairFormData = {
          receivedBy: repair.receivedBy,
          warranty: repair.warranty,
          code: repair.code,
          article: repair.article,
          brand: repair.brand,
          model: repair.model,
          serialImei: repair.serialImei,
          provider: repair.provider,
          requestBudget: repair.requestBudget,
          content: repair.content,
          problem: repair.problem,
          deliveryDate: repair.deliveryDate,
          client: {
            name: repair.client.name,
            surname: repair.client.surname,
            phone: repair.client.phone,
            ticketNumber: repair.client.ticketNumber,
            email: repair.client.email,
            address: repair.client.address
          }
        };
        reset(formData);
      } else {
        navigate('/repairs');
      }
    } else {
      setNextRepairNumber(getNextRepairNumber());
    }
  }, [id, getRepairById, reset, navigate, getNextRepairNumber]);
  
  const onSubmit: SubmitHandler<RepairFormData> = (data) => {
    if (isEditMode && id) {
      updateRepair(id, data);
      navigate(`/repairs/${id}`);
    } else {
      addRepair(data);
      navigate('/repairs');
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
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditMode ? 'Editar Reparación' : 'Nueva Reparación'}
          </h2>
        </div>
        {!isEditMode && (
          <div className="flex items-center space-x-2">
            <span className="text-gray-500 text-sm">Próximo N° de Reparación:</span>
            <span className="font-medium text-blue-600">{nextRepairNumber}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card title="Información de la Reparación" className="lg:col-span-1">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Recibido por</label>
                <Controller
                  name="receivedBy"
                  control={control}
                  rules={{ required: 'Este campo es requerido' }}
                  render={({ field }) => (
                    <input
                      type="text"
                      className={`mt-1 block w-full rounded-md shadow-sm text-sm ${
                        errors.receivedBy ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      {...field}
                    />
                  )}
                />
                {errors.receivedBy && (
                  <p className="mt-1 text-sm text-red-600">{errors.receivedBy.message}</p>
                )}
              </div>
              
              <div className="flex space-x-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">Código</label>
                  <Controller
                    name="code"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                        {...field}
                      />
                    )}
                  />
                </div>
                
                <div className="flex items-center mt-7">
                  <Controller
                    name="warranty"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <div className="flex items-center">
                        <input
                          id="warranty"
                          type="checkbox"
                          checked={value}
                          onChange={onChange}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="warranty" className="ml-2 block text-sm text-gray-700">
                          Garantía
                        </label>
                      </div>
                    )}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Artículo</label>
                <Controller
                  name="article"
                  control={control}
                  rules={{ required: 'Este campo es requerido' }}
                  render={({ field }) => (
                    <input
                      type="text"
                      className={`mt-1 block w-full rounded-md shadow-sm text-sm ${
                        errors.article ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      {...field}
                    />
                  )}
                />
                {errors.article && (
                  <p className="mt-1 text-sm text-red-600">{errors.article.message}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Marca</label>
                  <Controller
                    name="brand"
                    control={control}
                    rules={{ required: 'Este campo es requerido' }}
                    render={({ field }) => (
                      <input
                        type="text"
                        className={`mt-1 block w-full rounded-md shadow-sm text-sm ${
                          errors.brand ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        }`}
                        {...field}
                      />
                    )}
                  />
                  {errors.brand && (
                    <p className="mt-1 text-sm text-red-600">{errors.brand.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Modelo</label>
                  <Controller
                    name="model"
                    control={control}
                    rules={{ required: 'Este campo es requerido' }}
                    render={({ field }) => (
                      <input
                        type="text"
                        className={`mt-1 block w-full rounded-md shadow-sm text-sm ${
                          errors.model ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        }`}
                        {...field}
                      />
                    )}
                  />
                  {errors.model && (
                    <p className="mt-1 text-sm text-red-600">{errors.model.message}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Serial / IMEI</label>
                <Controller
                  name="serialImei"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                      {...field}
                    />
                  )}
                />
              </div>
              
              <div className="flex space-x-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">Proveedor</label>
                  <Controller
                    name="provider"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                        {...field}
                      />
                    )}
                  />
                </div>
                
                <div className="flex items-center mt-7">
                  <Controller
                    name="requestBudget"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <div className="flex items-center">
                        <input
                          id="requestBudget"
                          type="checkbox"
                          checked={value}
                          onChange={onChange}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="requestBudget" className="ml-2 block text-sm text-gray-700">
                          Solicitar Presupuesto
                        </label>
                      </div>
                    )}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Contenido</label>
                <Controller
                  name="content"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                      {...field}
                    />
                  )}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Descripción del Problema</label>
                <Controller
                  name="problem"
                  control={control}
                  rules={{ required: 'Este campo es requerido' }}
                  render={({ field }) => (
                    <textarea
                      rows={3}
                      className={`mt-1 block w-full rounded-md shadow-sm text-sm ${
                        errors.problem ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      {...field}
                    />
                  )}
                />
                {errors.problem && (
                  <p className="mt-1 text-sm text-red-600">{errors.problem.message}</p>
                )}
              </div>
            </div>
          </Card>
          
          <Card title="Información del Cliente" className="lg:col-span-1">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre</label>
                  <Controller
                    name="client.name"
                    control={control}
                    rules={{ required: 'Este campo es requerido' }}
                    render={({ field }) => (
                      <input
                        type="text"
                        className={`mt-1 block w-full rounded-md shadow-sm text-sm ${
                          errors.client?.name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        }`}
                        {...field}
                      />
                    )}
                  />
                  {errors.client?.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.client.name.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Apellido</label>
                  <Controller
                    name="client.surname"
                    control={control}
                    rules={{ required: 'Este campo es requerido' }}
                    render={({ field }) => (
                      <input
                        type="text"
                        className={`mt-1 block w-full rounded-md shadow-sm text-sm ${
                          errors.client?.surname ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        }`}
                        {...field}
                      />
                    )}
                  />
                  {errors.client?.surname && (
                    <p className="mt-1 text-sm text-red-600">{errors.client.surname.message}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                <Controller
                  name="client.phone"
                  control={control}
                  rules={{ required: 'Este campo es requerido' }}
                  render={({ field }) => (
                    <input
                      type="text"
                      className={`mt-1 block w-full rounded-md shadow-sm text-sm ${
                        errors.client?.phone ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      {...field}
                    />
                  )}
                />
                {errors.client?.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.client.phone.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                <Controller
                  name="client.email"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="email"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                      {...field}
                    />
                  )}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Número de Ticket</label>
                <Controller
                  name="client.ticketNumber"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                      {...field}
                    />
                  )}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Dirección</label>
                <Controller
                  name="client.address"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                      {...field}
                    />
                  )}
                />
              </div>
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <p className="text-xs text-gray-500">
                  Nota: El tiempo estimado para la gestión de garantía/reparación es de 15 a 90 días.
                </p>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <Button
            variant="outline"
            type="button"
            onClick={() => navigate(-1)}
            icon={<X className="h-4 w-4" />}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            type="submit"
            icon={<Save className="h-4 w-4" />}
            disabled={!isDirty}
          >
            {isEditMode ? 'Actualizar Reparación' : 'Crear Reparación'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RepairForm;