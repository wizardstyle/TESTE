import { Repair } from '../types/repair';

export const printRepairList = (repairs: Repair[]) => {
  // Create a temporary div element to hold the content
  const printDiv = document.createElement('div');
  
  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    @media print {
      body { font-family: Arial, sans-serif; }
      table { width: 100%; border-collapse: collapse; margin-top: 20px; }
      th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
      th { background-color: #f8f9fa; }
      .header { margin-bottom: 20px; }
      .title { font-size: 24px; font-weight: bold; }
      .subtitle { font-size: 14px; color: #666; }
      .date { font-size: 12px; color: #666; margin-top: 5px; }
      .status-badge {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;
      }
      .status-pending { background-color: #fff3cd; color: #856404; }
      .status-in-progress { background-color: #cce5ff; color: #004085; }
      .status-completed { background-color: #d4edda; color: #155724; }
      .status-supplier { background-color: #e2e3ff; color: #4c4f7c; }
      @page { margin: 2cm; }
    }
  `;
  document.head.appendChild(style);

  // Create content HTML
  printDiv.innerHTML = `
    <div class="header">
      <div class="title">Lista de Reparaciones</div>
      <div class="subtitle">LumoraFix - Sistema de Gestión de Reparaciones</div>
      <div class="date">Fecha de impresión: ${new Date().toLocaleDateString()}</div>
    </div>
    <table>
      <thead>
        <tr>
          <th>N° Reparación</th>
          <th>Fecha</th>
          <th>Cliente</th>
          <th>Dispositivo</th>
          <th>Estado</th>
          <th>Garantía</th>
        </tr>
      </thead>
      <tbody>
        ${repairs.map(repair => `
          <tr>
            <td>${repair.repairNumber}</td>
            <td>${repair.date}</td>
            <td>
              ${repair.client.name} ${repair.client.surname}<br>
              <small>${repair.client.phone}</small>
            </td>
            <td>
              ${repair.brand} ${repair.model}<br>
              <small>${repair.article}</small>
            </td>
            <td>
              <div class="status-badge status-${repair.status}">
                ${getStatusText(repair.status)}
              </div>
            </td>
            <td>${repair.warranty ? 'Con Garantía' : 'Sin Garantía'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  // Store the current page content
  const originalContent = document.body.innerHTML;

  // Replace the page content with our print content
  document.body.innerHTML = printDiv.innerHTML;

  // Open the native print dialog
  window.print();

  // Restore the original content after printing
  document.body.innerHTML = originalContent;

  // Remove the added style
  style.remove();
};

const getStatusText = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'Pendiente';
    case 'in_progress':
      return 'En Proceso';
    case 'completed':
      return 'Completado';
    case 'supplier_delivered':
      return 'Reparado en tienda';
    default:
      return 'Desconocido';
  }
}; 