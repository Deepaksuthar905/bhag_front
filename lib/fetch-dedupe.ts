/**
 * Merges concurrent identical GET requests so one network call serves all callers.
 */
const inflightGet = new Map<string, Promise<unknown>>();

export function dedupeGet<T>(key: string, execute: () => Promise<T>): Promise<T> {
  const existing = inflightGet.get(key);
  if (existing) return existing as Promise<T>;
  const promise = execute().finally(() => {
    inflightGet.delete(key);
  });
  inflightGet.set(key, promise);
  return promise;
}
