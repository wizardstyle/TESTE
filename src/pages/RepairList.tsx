import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Plus, Search, Filter, Trash2, Edit, Eye, 
  CheckCircle, ArrowUpDown, Download, Printer 
} from 'lucide-react';
import { useRepairs } from '../context/RepairContext';
import Button from '../components/Button';
import Card from '../components/Card';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';
import WarrantyBadge from '../components/WarrantyBadge';
import { printRepairList } from '../utils/printService';

const RepairList: React.FC = () => {
  const { repairs, deleteRepair, markDelivered } = useRepairs();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [warrantyFilter, setWarrantyFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedRepair, setSelectedRepair] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isMarkDeliveredModalOpen, setIsMarkDeliveredModalOpen] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const querySearch = searchParams.get('search');
    if (querySearch) {
      setSearchTerm(querySearch);
    }
  }, [location.search]);

  const filteredRepairs = repairs.filter(repair => {
    const matchesSearch = searchTerm === '' || (() => {
      const term = searchTerm.toLowerCase();
      switch (searchField) {
        case 'repairNumber':
          return repair.repairNumber.toLowerCase().includes(term);
        case 'client':
          return `${repair.client.name} ${repair.client.surname}`.toLowerCase().includes(term) ||
                 repair.client.phone.includes(term) ||
                 repair.client.email.toLowerCase().includes(term);
        case 'device':
          return repair.article.toLowerCase().includes(term) ||
                 repair.brand.toLowerCase().includes(term) ||
                 repair.model.toLowerCase().includes(term) ||
                 repair.serialImei.toLowerCase().includes(term);
        case 'all':
        default:
          return repair.repairNumber.toLowerCase().includes(term) ||
                 `${repair.client.name} ${repair.client.surname}`.toLowerCase().includes(term) ||
                 repair.client.phone.includes(term) ||
                 repair.client.email.toLowerCase().includes(term) ||
                 repair.article.toLowerCase().includes(term) ||
                 repair.brand.toLowerCase().includes(term) ||
                 repair.model.toLowerCase().includes(term) ||
                 repair.serialImei.toLowerCase().includes(term);
      }
    })();

    const matchesStatus = statusFilter === 'all' || repair.status === statusFilter;
    const matchesWarranty = warrantyFilter === 'all' || 
      (warrantyFilter === 'warranty' && repair.warranty) ||
      (warrantyFilter === 'no-warranty' && !repair.warranty);

    return matchesSearch && matchesStatus && matchesWarranty;
  });

  const sortedRepairs = [...filteredRepairs].sort((a, b) => {
    let valueA, valueB;

    switch (sortBy) {
      case 'date':
        valueA = new Date(a.date).getTime();
        valueB = new Date(b.date).getTime();
        break;
      case 'client':
        valueA = `${a.client.name} ${a.client.surname}`.toLowerCase();
        valueB = `${b.client.name} ${b.client.surname}`.toLowerCase();
        break;
      case 'repairNumber':
        valueA = a.repairNumber;
        valueB = b.repairNumber;
        break;
      case 'status':
        valueA = a.status;
        valueB = b.status;
        break;
      default:
        valueA = a.date;
        valueB = b.date;
    }

    const comparison = sortOrder === 'asc' ? 1 : -1;
    if (valueA < valueB) return -1 * comparison;
    if (valueA > valueB) return 1 * comparison;
    return 0;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/repairs?search=${encodeURIComponent(searchTerm)}`);
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };

  const handleWarrantyFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setWarrantyFilter(e.target.value);
  };

  const handleSearchFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchField(e.target.value);
  };

  const handleSortChange = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleDelete = () => {
    if (selectedRepair) {
      deleteRepair(selectedRepair);
      setIsDeleteModalOpen(false);
      setSelectedRepair(null);
    }
  };

  const handleMarkDelivered = () => {
    if (selectedRepair) {
      markDelivered(selectedRepair, deliveryDate);
      setIsMarkDeliveredModalOpen(false);
      setSelectedRepair(null);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSearchField('all');
    setStatusFilter('all');
    setWarrantyFilter('all');
    setSortBy('date');
    setSortOrder('desc');
    navigate('/repairs');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Lista de Reparaciones</h2>
        <div className="mt-3 sm:mt-0">
          <Button 
            variant="primary"
            icon={<Plus className="h-4 w-4" />}
            onClick={() => navigate('/repairs/new')}
          >
            Nueva Reparación
          </Button>
        </div>
      </div>
      
      <Card>
        <div className="flex flex-col space-y-4">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar reparaciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm pl-10 pr-12 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <select
              value={searchField}
              onChange={handleSearchFieldChange}
              className="rounded-md border border-gray-300 shadow-sm py-2 pl-3 pr-8 text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos los Campos</option>
              <option value="repairNumber">Número de Reparación</option>
              <option value="client">Información del Cliente</option>
              <option value="device">Información del Dispositivo</option>
            </select>
            
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="rounded-md border border-gray-300 shadow-sm py-2 pl-3 pr-8 text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos los Estados</option>
              <option value="pending">Pendiente</option>
              <option value="in_progress">En Proceso</option>
              <option value="completed">Completado</option>
            </select>
            
            <select
              value={warrantyFilter}
              onChange={handleWarrantyFilterChange}
              className="rounded-md border border-gray-300 shadow-sm py-2 pl-3 pr-8 text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todas las Garantías</option>
              <option value="warranty">Con Garantía</option>
              <option value="no-warranty">Sin Garantía</option>
            </select>
            
            <div className="flex gap-2">
              <Button
                type="submit"
                variant="primary"
                size="sm"
                icon={<Search className="h-4 w-4" />}
              >
                Buscar
              </Button>
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearFilters}
              >
                Limpiar
              </Button>
            </div>
          </form>
          
          <div className="flex flex-wrap gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              icon={<Printer className="h-4 w-4" />}
              onClick={() => printRepairList(sortedRepairs)}
            >
              Imprimir
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              icon={<Download className="h-4 w-4" />}
            >
              Exportar
            </Button>
          </div>
        </div>
        
        {sortedRepairs.length > 0 ? (
          <div className="overflow-x-auto -mx-6 mt-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSortChange('repairNumber')}
                  >
                    <div className="flex items-center">
                      N° Reparación
                      {sortBy === 'repairNumber' && (
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSortChange('date')}
                  >
                    <div className="flex items-center">
                      Fecha
                      {sortBy === 'date' && (
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSortChange('client')}
                  >
                    <div className="flex items-center">
                      Cliente
                      {sortBy === 'client' && (
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dispositivo
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSortChange('status')}
                  >
                    <div className="flex items-center">
                      Estado
                      {sortBy === 'status' && (
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Garantía
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedRepairs.map((repair) => (
                  <tr key={repair.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{repair.repairNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{repair.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {repair.client.name} {repair.client.surname}
                      </div>
                      <div className="text-xs text-gray-500">{repair.client.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{repair.brand} {repair.model}</div>
                      <div className="text-xs text-gray-500">{repair.article}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={repair.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <WarrantyBadge warranty={repair.warranty} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button 
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() => navigate(`/repairs/${repair.id}`)}
                          title="Ver detalles"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          className="text-green-600 hover:text-green-900"
                          onClick={() => {
                            setSelectedRepair(repair.id);
                            setIsMarkDeliveredModalOpen(true);
                          }}
                          title="Marcar como entregado"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button 
                          className="text-gray-600 hover:text-gray-900"
                          onClick={() => navigate(`/repairs/${repair.id}/edit`)}
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900"
                          onClick={() => {
                            setSelectedRepair(repair.id);
                            setIsDeleteModalOpen(true);
                          }}
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-32 text-center">
            <div className="inline-flex rounded-full bg-gray-100 p-6">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">No se encontraron reparaciones</h3>
            <p className="mt-1 text-sm text-gray-500">
              No hay reparaciones que coincidan con tus criterios de búsqueda. Intenta ajustar los filtros.
            </p>
            <div className="mt-6">
              <Button 
                variant="primary"
                onClick={clearFilters}
              >
                Limpiar Filtros
              </Button>
            </div>
          </div>
        )}
      </Card>
      
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmar Eliminación"
      >
        <div className="py-3">
          <p className="text-gray-700">
            ¿Estás seguro de que deseas eliminar esta reparación? Esta acción no se puede deshacer.
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
            Eliminar
          </Button>
        </div>
      </Modal>
      
      <Modal
        isOpen={isMarkDeliveredModalOpen}
        onClose={() => setIsMarkDeliveredModalOpen(false)}
        title="Marcar como Entregado"
      >
        <div className="py-3">
          <p className="text-gray-700 mb-4">
            Ingresa la fecha de entrega para esta reparación:
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
            Confirmar Entrega
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default RepairList;