declare module 'expo-sqlite' {
  export interface SQLiteDatabase {
    transaction: (
      callback: (transaction: SQLiteTransaction) => void,
      errorCallback?: (error: Error) => void,
      successCallback?: () => void
    ) => void;
  }

  export interface SQLiteTransaction {
    executeSql: (
      sqlStatement: string,
      args?: any[],
      callback?: (transaction: SQLiteTransaction, resultSet: SQLResultSet) => void,
      errorCallback?: (transaction: SQLiteTransaction, error: Error) => boolean
    ) => void;
  }

  export interface SQLResultSet {
    insertId: number;
    rowsAffected: number;
    rows: {
      length: number;
      item: (index: number) => any;
    };
  }

  export function openDatabase(name: string): SQLiteDatabase;
} 