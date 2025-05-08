import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

// Define types for SQLite
type SQLiteTransaction = {
  executeSql: (
    sqlStatement: string,
    args?: any[],
    callback?: (transaction: SQLiteTransaction, resultSet: SQLResultSet) => void,
    errorCallback?: (transaction: SQLiteTransaction, error: Error) => boolean
  ) => void;
};

interface Repair {
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

// Open database connection
const db = SQLite.openDatabase('repairs.db');

// Initialize database tables
export const initDatabase = () => {
  return new Promise<boolean>((resolve, reject) => {
    db.transaction((tx: SQLite.SQLiteTransaction) => {
      // Create repairs table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS repairs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          device_type TEXT NOT NULL,
          brand TEXT NOT NULL,
          model TEXT NOT NULL,
          problem_description TEXT NOT NULL,
          customer_name TEXT NOT NULL,
          customer_phone TEXT,
          customer_email TEXT,
          status TEXT NOT NULL,
          estimated_cost REAL,
          actual_cost REAL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );`,
        [],
        () => {
          console.log('Database initialized successfully');
          resolve(true);
        },
        (_, error: Error) => {
          console.error('Error initializing database:', error);
          reject(error);
          return false;
        }
      );
    });
  });
};

// Add a new repair
export const addRepair = (repair: Omit<Repair, 'id' | 'created_at' | 'updated_at'>) => {
  return new Promise<number>((resolve, reject) => {
    db.transaction((tx: SQLite.SQLiteTransaction) => {
      tx.executeSql(
        `INSERT INTO repairs (
          device_type, brand, model, problem_description,
          customer_name, customer_phone, customer_email,
          status, estimated_cost, actual_cost
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          repair.device_type,
          repair.brand,
          repair.model,
          repair.problem_description,
          repair.customer_name,
          repair.customer_phone || null,
          repair.customer_email || null,
          repair.status,
          repair.estimated_cost || null,
          repair.actual_cost || null,
        ],
        (_, result: SQLite.SQLResultSet) => {
          resolve(result.insertId);
        },
        (_, error: Error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

// Get all repairs
export const getAllRepairs = () => {
  return new Promise<Repair[]>((resolve, reject) => {
    db.transaction((tx: SQLite.SQLiteTransaction) => {
      tx.executeSql(
        'SELECT * FROM repairs ORDER BY created_at DESC',
        [],
        (_, { rows }: SQLite.SQLResultSet) => {
          const repairs: Repair[] = [];
          for (let i = 0; i < rows.length; i++) {
            repairs.push(rows.item(i) as Repair);
          }
          resolve(repairs);
        },
        (_, error: Error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

// Get repair by ID
export const getRepairById = (id: number) => {
  return new Promise<Repair | null>((resolve, reject) => {
    db.transaction((tx: SQLite.SQLiteTransaction) => {
      tx.executeSql(
        'SELECT * FROM repairs WHERE id = ?',
        [id],
        (_, { rows }: SQLite.SQLResultSet) => {
          resolve(rows.length > 0 ? (rows.item(0) as Repair) : null);
        },
        (_, error: Error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

// Update repair status
export const updateRepairStatus = (id: number, status: string) => {
  return new Promise<number>((resolve, reject) => {
    db.transaction((tx: SQLite.SQLiteTransaction) => {
      tx.executeSql(
        'UPDATE repairs SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [status, id],
        (_, result: SQLite.SQLResultSet) => {
          resolve(result.rowsAffected);
        },
        (_, error: Error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

// Update repair costs
export const updateRepairCosts = (id: number, estimated_cost: number, actual_cost: number) => {
  return new Promise<number>((resolve, reject) => {
    db.transaction((tx: SQLite.SQLiteTransaction) => {
      tx.executeSql(
        'UPDATE repairs SET estimated_cost = ?, actual_cost = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [estimated_cost, actual_cost, id],
        (_, result: SQLite.SQLResultSet) => {
          resolve(result.rowsAffected);
        },
        (_, error: Error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

// Delete repair
export const deleteRepair = (id: number) => {
  return new Promise<number>((resolve, reject) => {
    db.transaction((tx: SQLite.SQLiteTransaction) => {
      tx.executeSql(
        'DELETE FROM repairs WHERE id = ?',
        [id],
        (_, result: SQLite.SQLResultSet) => {
          resolve(result.rowsAffected);
        },
        (_, error: Error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}; 