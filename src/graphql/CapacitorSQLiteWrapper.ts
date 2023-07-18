// CapacitorSQLiteWrapper.ts
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from "@capacitor-community/sqlite";

// ref: https://github.com/apollographql/apollo-cache-persist/blob/master/src/storageWrappers/AsyncStorageWrapper.ts#L15
// ref: https://github.com/react-native-async-storage/async-storage/blob/master/src/AsyncStorage.ts#L68
export class CapacitorSQLiteWrapper {
  private db: SQLiteDBConnection | null = null;

  // ref: https://github.com/capacitor-community/sqlite/blob/master/docs/Ionic-React-Usage.md#react-sqlite-hook-declaration-for-platforms-including-web
  async initializeDB(database: string) {
    const sqlite = new SQLiteConnection(CapacitorSQLite);

    const ret = await sqlite.checkConnectionsConsistency();
    const isConn = (await sqlite.isConnection(database, false)).result;

    if (ret.result && isConn) {
      console.log("Connection exists");
      this.db = await sqlite.retrieveConnection(database, false);
    } else {
      console.log("Connection does not exist");
      this.db = await sqlite.createConnection(
        database,
        false,
        "no-encryption",
        1,
        false
      );
    }

    await this.db.open();
    await this.db.execute(
      "CREATE TABLE IF NOT EXISTS kvs (key TEXT PRIMARY KEY, value TEXT);"
    );
  }

  async getItem(key: string) {
    if (!this.db) return null;
    const statement = `SELECT value FROM kvs WHERE key = ?`;
    const values = [key];
    const res = await this.db.query(statement, values);
    console.log(res);
    console.log(key);
    if (res.values && res.values[0] && res.values[0].value) {
      return JSON.parse(res.values[0].value);
    }
    return null;
  }

  async setItem(key: string, value: any) {
    if (!this.db) return;
    const statement = `INSERT OR REPLACE INTO kvs(key, value) VALUES (?, ?)`;
    const values = [key, JSON.stringify(value)];
    await this.db.executeSet([{ statement, values }]);
  }

  async removeItem(key: string) {
    if (!this.db) return;
    const statement = `DELETE FROM kvs WHERE key = ?`;
    const values = [key];
    await this.db.executeSet([{ statement, values }]);
  }

  async query(query: string) {
    if (!this.db) return;
    return await this.db.query(query);
  }
}

export const database = new CapacitorSQLiteWrapper();
