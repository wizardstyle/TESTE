import { format } from 'date-fns';
import { Repair } from '../types';

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

export class TicketPrinter {
  private static getSettings(): PrinterSettings {
    try {
      const savedSettings = localStorage.getItem('printerSettings');
      if (savedSettings) {
        return JSON.parse(savedSettings);
      }
    } catch (error) {
      console.error('Error loading printer settings:', error);
    }
    return defaultPrinterSettings;
  }

  private static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'euro'
    }).format(amount);
  }

  private static formatDate(date: string): string {
    return format(new Date(date), 'dd/MM/yyyy');
  }

  private static centerText(text: string, width: number = 32): string {
    const padding = Math.max(0, width - text.length);
    const leftPad = Math.floor(padding / 2);
    return ' '.repeat(leftPad) + text;
  }

  private static formatLine(text: string, width: number = 32): string {
    if (text.length <= width) {
      return text;
    }
    return text.substring(0, width - 3) + '...';
  }

  public static generateTicketContent(repair: Repair): string {
    const settings = this.getSettings();
    const lines: string[] = [];
    const divider = '-'.repeat(32);

    // Header
    if (settings.showLogo) {
      lines.push(this.centerText('Sonimag'));
      lines.push(this.centerText('Av. Meritxell, 97'));
      lines.push(this.centerText('Andorra La Vella'));
      lines.push(this.centerText('Teléfono: (376) 860 039'));
    }

    if (settings.customHeader) {
      lines.push(divider);
      settings.customHeader.split('\n').forEach(line => {
        lines.push(this.centerText(line.trim()));
      });
    }

    lines.push(divider);

    // Repair Info
    lines.push(`Repair #: ${repair.repairNumber}`);
    lines.push(`Fecha: ${this.formatDate(repair.date)}`);
    lines.push(`Estado: ${repair.status.toUpperCase()}`);
    lines.push(divider);

    // Client Info
    lines.push('CLIENTE');
    lines.push(`Nombre: ${repair.client.name} ${repair.client.surname}`);
    lines.push(`Tef: ${repair.client.phone}`);
    if (repair.client.email) {
      lines.push(`Email: ${this.formatLine(repair.client.email)}`);
    }
    lines.push(divider);

    // Device Info
    lines.push('DISPOSITIVO');
    lines.push(`Artículo: ${repair.article}`);
    lines.push(`Marca: ${repair.brand}`);
    lines.push(`Modelo: ${repair.model}`);
    if (repair.serialImei) {
      lines.push(`Serial/IMEI: ${repair.serialImei}`);
    }
    lines.push(divider);

    // Problem
    lines.push('DESCRIPCIÓN DEL PROBLEMA');
    const problemWords = repair.problem.split(' ');
    let currentLine = '';
    
    for (const word of problemWords) {
      if ((currentLine + ' ' + word).length <= 32) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
    lines.push(divider);

    // Additional Info
    lines.push(`Garantía: ${repair.warranty ? 'SI' : 'NO'}`);
    lines.push(`Presupuesto requerido ${repair.requestBudget ? 'SI' : 'NO'}`);
    if (repair.deliveryDate) {
      lines.push(`Delivered: ${this.formatDate(repair.deliveryDate)}`);
    }

    if (settings.showFooter) {
      lines.push(divider);
      lines.push(this.centerText('¡Gracias por su confianza!'));
      lines.push(this.centerText('Tiempo de reparación:15-90 días'));
      lines.push(this.centerText('Tiempo de reparación: 90 días'));
    }

    if (settings.customFooter) {
      lines.push(divider);
      settings.customFooter.split('\n').forEach(line => {
        lines.push(this.centerText(line.trim()));
      });
    }

    lines.push('\n\n\n'); // Paper feed

    return lines.join('\n');
  }

  public static async printTicket(repair: Repair): Promise<void> {
    try {
      const content = this.generateTicketContent(repair);
      const settings = this.getSettings();
      
      // Create an iframe for printing
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);

      // Write content to iframe
      const doc = iframe.contentWindow?.document;
      if (!doc) {
        throw new Error('Failed to create print frame');
      }

      doc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print Ticket - ${repair.repairNumber}</title>
            <style>
              body {
                font-family: monospace;
                font-size: ${settings.fontSize}px;
                line-height: 1.2;
                margin: 0;
                padding: ${settings.marginTop}mm ${settings.marginRight}mm ${settings.marginBottom}mm ${settings.marginLeft}mm;
                width: ${settings.paperWidth}mm;
                margin: 0 auto;
              }
              @media print {
                body {
                  width: ${settings.paperWidth}mm;
                  margin: 0;
                  padding: ${settings.marginTop}mm ${settings.marginRight}mm ${settings.marginBottom}mm ${settings.marginLeft}mm;
                }
                @page {
                  size: ${settings.paperWidth}mm ${settings.paperHeight}mm;
                  margin: 0;
                }
              }
            </style>
          </head>
          <body>
            <pre>${content}</pre>
          </body>
        </html>
      `);
      doc.close();

      // Get the iframe's window object
      const iframeWindow = iframe.contentWindow;
      if (!iframeWindow) {
        throw new Error('Failed to access print frame window');
      }

      // Print with system dialog
      const printResult = await iframeWindow.print();
      
      // Clean up
      document.body.removeChild(iframe);

      return Promise.resolve();
    } catch (error) {
      console.error('Error printing ticket:', error);
      throw new Error('Failed to print ticket');
    }
  }
}