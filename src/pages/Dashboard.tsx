import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Wrench, Clock, CheckCircle, AlertTriangle, 
  ChevronRight, TrendingUp, FileWarning, Calendar,
  Truck
} from 'lucide-react';
import { useRepairs } from '../context/RepairContext';
import Card from '../components/Card';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';

const Dashboard: React.FC = () => {
  const { repairs, loading, error } = useRepairs();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Error al cargar los datos</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (!repairs || repairs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Wrench className="h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No hay reparaciones</h2>
        <p className="text-gray-600 mb-6">Comienza agregando una nueva reparación</p>
        <Button 
          variant="primary"
          onClick={() => navigate('/repairs/new')}
        >
          Nueva reparación
        </Button>
      </div>
    );
  }

  const stats = {
    total: repairs.length,
    pending: repairs.filter(r => r.status === 'pending').length,
    inProgress: repairs.filter(r => r.status === 'in_progress').length,
    supplierDelivered: repairs.filter(r => r.status === 'supplier_delivered').length,
    completed: repairs.filter(r => r.status === 'completed').length,
    warranty: repairs.filter(r => r.warranty).length
  };

  const recentRepairs = repairs.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Panel de control</h2>
        <div className="mt-3 sm:mt-0">
          <Button 
            variant="primary"
            icon={<Wrench className="h-4 w-4" />}
            onClick={() => navigate('/repairs/new')}
          >
            Nueva reparación
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="bg-blue-50 border border-blue-100">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-md bg-blue-100">
              <Wrench className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-blue-600">Total Reparaciones</p>
              <p className="text-2xl font-semibold text-blue-900">{stats.total}</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-yellow-50 border border-yellow-100">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-md bg-yellow-100">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-yellow-600">Pendientes</p>
              <p className="text-2xl font-semibold text-yellow-900">{stats.pending}</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-indigo-50 border border-indigo-100">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-md bg-indigo-100">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-indigo-600">En Proceso</p>
              <p className="text-2xl font-semibold text-indigo-900">{stats.inProgress}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-purple-50 border border-purple-100">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-md bg-purple-100">
              <Truck className="h-5 w-5 text-purple-600" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-purple-600">En Tienda Reparado</p>
              <p className="text-2xl font-semibold text-purple-900">{stats.supplierDelivered}</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-green-50 border border-green-100">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-md bg-green-100">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-green-600">Completadas</p>
              <p className="text-2xl font-semibold text-green-900">{stats.completed}</p>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card title="Reparaciones Recientes">
          <div className="divide-y divide-gray-200">
            {recentRepairs.length > 0 ? (
              recentRepairs.map((repair) => (
                <div key={repair.id} className="py-3 flex items-center justify-between hover:bg-gray-50 -mx-6 px-6 rounded transition-colors">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Wrench className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">
                        {repair.article} - {repair.brand} {repair.model}
                      </p>
                      <p className="text-xs text-gray-500">
                        {repair.client.name} {repair.client.surname} · {repair.repairNumber}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <StatusBadge status={repair.status} />
                    <button 
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => navigate(`/repairs/${repair.id}`)}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-4 text-center text-gray-500">
                No se encontraron reparaciones
              </div>
            )}
          </div>
          {repairs.length > 5 && (
            <div className="mt-4 flex justify-center">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/repairs')}
              >
                Ver Todas las Reparaciones
              </Button>
            </div>
          )}
        </Card>
        
        <Card title="Estadísticas de Reparaciones">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Distribución por Estado</h4>
              <div className="mt-2 relative pt-1">
                <div className="flex h-4 mb-1 overflow-hidden text-xs rounded">
                  {stats.total > 0 && (
                    <>
                      <div 
                        style={{ width: `${(stats.pending / stats.total) * 100}%` }}
                        className="flex flex-col justify-center text-center text-white bg-yellow-500 shadow-none whitespace-nowrap"
                      ></div>
                      <div 
                        style={{ width: `${(stats.inProgress / stats.total) * 100}%` }}
                        className="flex flex-col justify-center text-center text-white bg-blue-500 shadow-none whitespace-nowrap"
                      ></div>
                      <div 
                        style={{ width: `${(stats.supplierDelivered / stats.total) * 100}%` }}
                        className="flex flex-col justify-center text-center text-white bg-purple-500 shadow-none whitespace-nowrap"
                      ></div>
                      <div 
                        style={{ width: `${(stats.completed / stats.total) * 100}%` }}
                        className="flex flex-col justify-center text-center text-white bg-green-500 shadow-none whitespace-nowrap"
                      ></div>
                    </>
                  )}
                </div>
                <div className="flex text-xs justify-between flex-wrap gap-2">
                  <span className="inline-flex items-center text-yellow-600">
                    <span className="w-2 h-2 mr-1 bg-yellow-500 rounded-full"></span>
                    Pendientes ({stats.pending})
                  </span>
                  <span className="inline-flex items-center text-blue-600">
                    <span className="w-2 h-2 mr-1 bg-blue-500 rounded-full"></span>
                    En Proceso ({stats.inProgress})
                  </span>
                  <span className="inline-flex items-center text-purple-600">
                    <span className="w-2 h-2 mr-1 bg-purple-500 rounded-full"></span>
                    En Tienda Reparado ({stats.supplierDelivered})
                  </span>
                  <span className="inline-flex items-center text-green-600">
                    <span className="w-2 h-2 mr-1 bg-green-500 rounded-full"></span>
                    Completadas ({stats.completed})
                  </span>
                </div>
              </div>
            </div>
            
            <div className="pt-3 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-500">Estado de Garantía</h4>
              <div className="mt-2 grid grid-cols-2 gap-4">
                <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-purple-600 font-medium">Con Garantía</p>
                      <p className="text-lg font-semibold text-purple-900">{stats.warranty}</p>
                    </div>
                    <FileWarning className="h-8 w-8 text-purple-400" />
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Sin Garantía</p>
                      <p className="text-lg font-semibold text-gray-900">{stats.total - stats.warranty}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      <Card title="Tendencias Mensuales" className="animate-fade-in">
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
          <p className="text-gray-500">La visualización del gráfico iría aquí en una app real</p>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;