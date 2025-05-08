import { useState, useCallback } from 'react';
import * as db from '../services/database';

export interface Repair {
  id: number;
  device_type: string;
  brand: string;
  model: string;
  problem_description: string;
  customer_name: string;
  customer_phone?: string;
  customer_email?: string;
  status: string;
  estimated_cost?: number;
  actual_cost?: number;
  created_at: string;
  updated_at: string;
}

export type NewRepair = Omit<Repair, 'id' | 'created_at' | 'updated_at'>;

export const useRepairs = () => {
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadRepairs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await db.getAllRepairs();
      setRepairs(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load repairs'));
    } finally {
      setLoading(false);
    }
  }, []);

  const addRepair = useCallback(async (repair: NewRepair) => {
    try {
      setLoading(true);
      setError(null);
      const id = await db.addRepair(repair);
      await loadRepairs(); // Reload the list to get the new repair
      return id;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add repair'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadRepairs]);

  const updateRepairStatus = useCallback(async (id: number, status: string) => {
    try {
      setLoading(true);
      setError(null);
      await db.updateRepairStatus(id, status);
      await loadRepairs(); // Reload the list to get the updated repair
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update repair status'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadRepairs]);

  const updateRepairCosts = useCallback(async (id: number, estimated_cost: number, actual_cost: number) => {
    try {
      setLoading(true);
      setError(null);
      await db.updateRepairCosts(id, estimated_cost, actual_cost);
      await loadRepairs(); // Reload the list to get the updated repair
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update repair costs'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadRepairs]);

  const deleteRepair = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await db.deleteRepair(id);
      await loadRepairs(); // Reload the list to reflect the deletion
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete repair'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadRepairs]);

  return {
    repairs,
    loading,
    error,
    loadRepairs,
    addRepair,
    updateRepairStatus,
    updateRepairCosts,
    deleteRepair,
  };
}; 