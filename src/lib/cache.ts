const memoryCache = new Map<string, unknown>();

export async function readJsonCache<T>(key: string) {
  return (memoryCache.get(key) as T | undefined) ?? null;
}

export async function writeJsonCache(key: string, value: unknown) {
  memoryCache.set(key, value);
}
