interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const store = new Map<string, CacheEntry<unknown>>();
const TTL = 5 * 60 * 1000; // 5 minutes

export const cache = {
  get<T>(key: string): T | null {
    const entry = store.get(key) as CacheEntry<T> | undefined;
    if (!entry) return null;
    if (Date.now() - entry.timestamp > TTL) return null;
    return entry.data;
  },

  getStale<T>(key: string): T | null {
    const entry = store.get(key) as CacheEntry<T> | undefined;
    return entry ? entry.data : null;
  },

  set<T>(key: string, data: T): void {
    store.set(key, { data, timestamp: Date.now() });
  },

  isStale(key: string): boolean {
    const entry = store.get(key);
    if (!entry) return true;
    return Date.now() - entry.timestamp > TTL;
  },

  getAge(key: string): number {
    const entry = store.get(key);
    if (!entry) return Infinity;
    return Date.now() - entry.timestamp;
  },
};
