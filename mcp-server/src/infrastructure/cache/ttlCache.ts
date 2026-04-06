interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class TtlCache<K, V> {
  private readonly cache = new Map<K, CacheEntry<V>>();

  public get(key: K): V | undefined {
    const entry = this.cache.get(key);
    if (!entry) {
      return undefined;
    }

    if (Date.now() >= entry.expiresAt) {
      this.cache.delete(key);
      return undefined;
    }

    return entry.value;
  }

  public set(key: K, value: V, ttlMs: number): void {
    const expiresAt = Date.now() + Math.max(0, ttlMs);
    this.cache.set(key, {
      value,
      expiresAt,
    });
  }

  public delete(key: K): void {
    this.cache.delete(key);
  }

  public clear(): void {
    this.cache.clear();
  }
}
