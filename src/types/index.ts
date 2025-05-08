export interface Client {
  name: string;
  surname: string;
  phone: string;
  email: string;
  address?: string;
  ticketNumber?: string;
}

export interface Repair {
  id: string;
  repairNumber: string;
  date: string;
  client: Client;
  article: string;
  brand: string;
  model: string;
  serialImei: string;
  problem: string;
  diagnosis?: string;
  solution?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'supplier_delivered';
  warranty: boolean;
  warrantyDetails?: string;
  cost?: number;
  deliveryDate?: string;
  notes?: string;
  accessories?: string[];
  code?: string;
  provider?: string;
  content?: string;
  receivedBy: string;
  requestBudget?: boolean;
}

export type RepairFormData = Omit<Repair, 'id' | 'date' | 'repairNumber' | 'status'>;