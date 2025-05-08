import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type BackupFrequency = 'daily' | 'weekly' | 'monthly';

interface BackupSettings {
  enabled: boolean;
  frequency: BackupFrequency;
  lastBackup: string | null;
  maxBackups: number;
}

interface BackupState extends BackupSettings {
  setEnabled: (enabled: boolean) => void;
  setFrequency: (frequency: BackupFrequency) => void;
  setLastBackup: (date: string) => void;
  setMaxBackups: (count: number) => void;
}

const useBackupStore = create<BackupState>()(
  persist(
    (set) => ({
      enabled: false,
      frequency: 'weekly',
      lastBackup: null,
      maxBackups: 5,
      setEnabled: (enabled) => set({ enabled }),
      setFrequency: (frequency) => set({ frequency }),
      setLastBackup: (date) => set({ lastBackup: date }),
      setMaxBackups: (count) => set({ maxBackups: count }),
    }),
    {
      name: 'backup-settings',
    }
  )
);

export default useBackupStore;