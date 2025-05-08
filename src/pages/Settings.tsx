import React, { useState, useEffect } from 'react';
import { Save, Upload, Download, Settings as SettingsIcon, Printer, Clock, Trash2 } from 'lucide-react';
import { useRepairs } from '../context/RepairContext';
import useBackupStore, { BackupFrequency } from '../store/backupStore';
import { BackupService } from '../utils/backupService';
import Card from '../components/Card';
import Button from '../components/Button';
import { format } from 'date-fns';

interface PrinterSettings {
  paperWidth: number;
  paperHeight: number;
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  fontSize: number;
  showLogo: boolean;
  showFooter: boolean;
  customHeader: string;
  customFooter: string;
}

const defaultPrinterSettings: PrinterSettings = {
  paperWidth: 80,
  paperHeight: 297,
  marginTop: 10,
  marginBottom: 10,
  marginLeft: 5,
  marginRight: 5,
  fontSize: 12,
  showLogo: true,
  showFooter: true,
  customHeader: '',
  customFooter: ''
};

const Settings: React.FC = () => {
  const { repairs } = useRepairs();
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [printerSettings, setPrinterSettings] = useState<PrinterSettings>(defaultPrinterSettings);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const backupStore = useBackupStore();

  const handleExport = () => {
    try {
      const data = JSON.stringify(repairs, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `repair-system-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setExportStatus('success');
      setTimeout(() => setExportStatus('idle'), 3000);
    } catch (error) {
      console.error('Error de exportación:', error);
      setExportStatus('error');
      setTimeout(() => setExportStatus('idle'), 3000);
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        setImportStatus('success');
        setTimeout(() => setImportStatus('idle'), 3000);
      } catch (error) {
        console.error('Error de importación:', error);
        setImportStatus('error');
        setTimeout(() => setImportStatus('idle'), 3000);
      }
    };
    reader.readAsText(file);
  };

  const handleSettingChange = (key: keyof PrinterSettings, value: number | boolean | string) => {
    setPrinterSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    try {
      localStorage.setItem('printerSettings', JSON.stringify(printerSettings));
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Error al guardar la configuración:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleResetSettings = () => {
    setPrinterSettings(defaultPrinterSettings);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-full bg-blue-100 text-blue-600">
            <SettingsIcon className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Configuración</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Configuración de Copias de Seguridad">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Copias de seguridad automáticas</span>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="autoBackup"
                  checked={backupStore.enabled}
                  onChange={(e) => backupStore.setEnabled(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
            </div>

            {backupStore.enabled && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Frecuencia</label>
                  <select
                    value={backupStore.frequency}
                    onChange={(e) => backupStore.setFrequency(e.target.value as BackupFrequency)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="daily">Diaria</option>
                    <option value="weekly">Semanal</option>
                    <option value="monthly">Mensual</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Número máximo de copias</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={backupStore.maxBackups}
                    onChange={(e) => backupStore.setMaxBackups(parseInt(e.target.value))}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  />
                </div>

                {backupStore.lastBackup && (
                  <div className="text-sm text-gray-500">
                    Última copia: {format(new Date(backupStore.lastBackup), 'dd/MM/yyyy HH:mm')}
                  </div>
                )}
              </>
            )}
          </div>
        </Card>

        <Card title="Configuración de Impresión">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Márgenes de Impresión</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Margen Superior (mm)</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={printerSettings.marginTop}
                    onChange={(e) => handleSettingChange('marginTop', Number(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Margen Inferior (mm)</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={printerSettings.marginBottom}
                    onChange={(e) => handleSettingChange('marginBottom', Number(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Margen Izquierdo (mm)</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={printerSettings.marginLeft}
                    onChange={(e) => handleSettingChange('marginLeft', Number(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Margen Derecho (mm)</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={printerSettings.marginRight}
                    onChange={(e) => handleSettingChange('marginRight', Number(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Ajuste los márgenes para controlar el espacio entre el contenido y los bordes del papel.
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Dimensiones del Papel</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Ancho del Papel (mm)
                  </label>
                  <input
                    type="number"
                    min="50"
                    max="300"
                    value={printerSettings.paperWidth}
                    onChange={(e) => handleSettingChange('paperWidth', Number(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Alto del Papel (mm)
                  </label>
                  <input
                    type="number"
                    min="50"
                    max="500"
                    value={printerSettings.paperHeight}
                    onChange={(e) => handleSettingChange('paperHeight', Number(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contenido del Ticket</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tamaño de Fuente (pt)
                  </label>
                  <input
                    type="number"
                    value={printerSettings.fontSize}
                    onChange={(e) => handleSettingChange('fontSize', Number(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showLogo"
                    checked={printerSettings.showLogo}
                    onChange={(e) => handleSettingChange('showLogo', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="showLogo" className="ml-2 block text-sm text-gray-900">
                    Mostrar Logo
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showFooter"
                    checked={printerSettings.showFooter}
                    onChange={(e) => handleSettingChange('showFooter', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="showFooter" className="ml-2 block text-sm text-gray-900">
                    Mostrar Pie de Página
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Encabezado Personalizado
                  </label>
                  <textarea
                    value={printerSettings.customHeader}
                    onChange={(e) => handleSettingChange('customHeader', e.target.value)}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Ingrese texto para el encabezado..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Pie de Página Personalizado
                  </label>
                  <textarea
                    value={printerSettings.customFooter}
                    onChange={(e) => handleSettingChange('customFooter', e.target.value)}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Ingrese texto para el pie de página..."
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={handleResetSettings}
              >
                Restaurar Valores
              </Button>
              <Button
                variant="primary"
                icon={<Save className="h-4 w-4" />}
                onClick={handleSaveSettings}
              >
                {saveStatus === 'success' ? '¡Guardado!' : 
                 saveStatus === 'error' ? 'Error al guardar' : 
                 'Guardar Configuración'}
              </Button>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card title="Gestión de Datos">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Copia de Seguridad</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Exporta tus registros de reparaciones a un archivo JSON para resguardo.
                </p>
                <Button
                  variant="primary"
                  icon={<Download className="h-4 w-4" />}
                  onClick={handleExport}
                >
                  {exportStatus === 'success' ? '¡Exportado!' : 
                   exportStatus === 'error' ? 'Error al exportar' : 
                   'Exportar Datos'}
                </Button>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Restaurar Datos</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Importa registros de reparaciones previamente exportados.
                </p>
                <div className="flex items-center space-x-3">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                    id="import-file"
                  />
                  <Button
                    variant="outline"
                    icon={<Upload className="h-4 w-4" />}
                    onClick={() => document.getElementById('import-file')?.click()}
                  >
                    {importStatus === 'success' ? '¡Importado!' :
                     importStatus === 'error' ? 'Error al importar' :
                     'Importar Datos'}
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Información del Sistema">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Versión</h3>
                <p className="mt-1 text-lg text-gray-900">1.0.0</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Tamaño de la Base de Datos</h3>
                <p className="mt-1 text-lg text-gray-900">{repairs.length} reparaciones</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Última Copia de Seguridad</h3>
                <p className="mt-1 text-lg text-gray-900">
                  {backupStore.lastBackup 
                    ? format(new Date(backupStore.lastBackup), 'dd/MM/yyyy HH:mm')
                    : 'Nunca'}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Se recomienda realizar copias de seguridad regularmente para prevenir la pérdida de datos. 
                  Exporte sus datos periódicamente y guárdelos en un lugar seguro.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;