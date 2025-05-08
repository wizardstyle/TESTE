import { differenceInDays, differenceInWeeks, differenceInMonths } from 'date-fns';
import { Repair } from '../types';

export class BackupService {
  private static getBackupFileName(date: Date): string {
    return `repair-system-backup-${date.toISOString().split('T')[0]}.json`;
  }

  private static shouldBackup(lastBackup: string | null): boolean {
    if (!lastBackup) return true;

    const now = new Date();
    const lastBackupDate = new Date(lastBackup);
    return differenceInDays(now, lastBackupDate) >= 1;
  }

  private static async cleanOldBackups(maxBackups: number = 7) {
    try {
      const backups = await this.listBackups();
      if (backups.length > maxBackups) {
        const toDelete = backups.slice(maxBackups);
        for (const backup of toDelete) {
          await this.deleteBackup(backup);
        }
      }
    } catch (error) {
      console.error('Error cleaning old backups:', error);
    }
  }

  private static async listBackups(): Promise<string[]> {
    const backups: string[] = [];
    try {
      const storedBackups = localStorage.getItem('repair-system-backups');
      if (storedBackups) {
        backups.push(...JSON.parse(storedBackups));
      }
    } catch (error) {
      console.error('Error listing backups:', error);
    }
    return backups.sort().reverse();
  }

  private static async deleteBackup(filename: string) {
    try {
      const backups = await this.listBackups();
      const updatedBackups = backups.filter(b => b !== filename);
      localStorage.setItem('repair-system-backups', JSON.stringify(updatedBackups));
      localStorage.removeItem(`backup-${filename}`);
    } catch (error) {
      console.error('Error deleting backup:', error);
    }
  }

  public static async performBackup(repairs: Repair[]) {
    try {
      const now = new Date();
      const filename = this.getBackupFileName(now);
      const backupData = JSON.stringify(repairs);

      // Store the backup
      localStorage.setItem(`backup-${filename}`, backupData);

      // Update backup list
      const backups = await this.listBackups();
      backups.unshift(filename);
      localStorage.setItem('repair-system-backups', JSON.stringify(backups));

      // Clean old backups
      await this.cleanOldBackups();

      console.log('Backup completed successfully:', filename);
    } catch (error) {
      console.error('Error performing backup:', error);
    }
  }

  public static async restoreBackup(filename: string): Promise<Repair[] | null> {
    try {
      const backupData = localStorage.getItem(`backup-${filename}`);
      if (backupData) {
        return JSON.parse(backupData);
      }
    } catch (error) {
      console.error('Error restoring backup:', error);
    }
    return null;
  }
}