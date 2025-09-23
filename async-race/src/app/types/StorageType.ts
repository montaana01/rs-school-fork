export type StorageType = {
  save<T>(key: string, data: T): void;
  load<T>(key: string): T;
  remove(key: string): void;
  clear(): void;
};
