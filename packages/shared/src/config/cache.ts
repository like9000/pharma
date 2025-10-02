type CacheEntry<T> = {
  expiresAt: number;
  value: T;
};

const CACHE_TTL_MS = 60_000;
const store = new Map<string, CacheEntry<unknown>>();

export const cache = {
  get<T>(key: string): T | undefined {
    const entry = store.get(key);
    if (!entry) return undefined;
    if (entry.expiresAt < Date.now()) {
      store.delete(key);
      return undefined;
    }
    return entry.value as T;
  },
  set<T>(key: string, value: T, ttlMs = CACHE_TTL_MS) {
    store.set(key, { value, expiresAt: Date.now() + ttlMs });
  },
  delete(key: string) {
    store.delete(key);
  },
  clear() {
    store.clear();
  },
};
