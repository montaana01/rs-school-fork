import type { StorageType } from '../types/StorageType.ts';

export default class StorageManager implements StorageType {
  private static instance: StorageManager;
  private localStorage: Storage;
  private constructor() {
    this.localStorage = localStorage;
  }

  public static getInstance(): StorageManager {
    if (!this.instance) {
      this.instance = new StorageManager();
    }
    return this.instance;
  }

  public save<T>(key: string, data: T): void {
    this.localStorage.setItem(key, JSON.stringify(data));
  }

  public load<T>(key: string): T | null {
    const storedData: string | null = this.localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : null;
  }

  public remove(key: string): void {
    this.localStorage.removeItem(key);
  }

  public clear(): void {
    this.localStorage.clear();
  }
}
