const memoryStorage = new Map<string, any>();
const cacheHits = new Map<
string,
{
  hits: number;
}
>();

/**
 * 最大存储的缓存数，超过这个把之前最小命中的缓存去掉
 */
const MAX_CACHE_SIZE = 1000;

class MemoryCache {
  /**
     * set item to local storage
     *
     * @example
     * memoryCache.set('key1', 'key1-value');
     * memoryCache.set('key1', 10);
     * memoryCache.set('key1', { id: 1, name: 'name 1'});
     * memoryCache.set('key1', 'key1-value', false);
     * @param key string
     * @param value string | number | object
     */
  set<TValue = string>(key: string, value: TValue) {
    if (!cacheHits.has(key)) {
      cacheHits.set(key, {
        hits: 0
      });
    }
    memoryStorage.set(key, value);
    if (cacheHits.size > MAX_CACHE_SIZE) {
      let minHitKey = '';
      let minHitCount = Number.MAX_SAFE_INTEGER;
      cacheHits.forEach((cacheHit, cacheHitKey) => {
        if (cacheHit.hits < minHitCount) {
          minHitCount = cacheHit.hits;
          minHitKey = cacheHitKey;
        }
      });

      if (minHitKey) {
        this.remove(minHitKey);
      }
    }
  }
  /**
     * get item from local storage
     *
     * @example
     * memoryCache.get('key1');
     * memoryCache.get<number>('key1');
     * memoryCache.get<User>('key1');
     * memoryCache.get<User[]>('key1');
     *
     * @param key string
     * @param compress compress data default true
     */
  get<TValue = string>(key: string): TValue {
    let cacheHit = cacheHits.get(key);
    if (!cacheHit) {
      cacheHit = {
        hits: 1
      };
    } else {
      cacheHit.hits++;
    }
    cacheHits.set(key, cacheHit);
    return memoryStorage.get(key);
  }
  /**
     * remove key from storage
     * @param key cache key
     */
  remove(key: string) {
    memoryStorage.delete(key);
    cacheHits.delete(key);
  }
  /**
     * has cache
     * @param key cache key
     */
  has(key: string) {
    return memoryStorage.has(key);
  }
  /**
     * clear all storage
     */
  clear() {
    memoryStorage.clear();
    cacheHits.clear();
  }
  /**
     * add item to list
     * @example
     * memoryCache.add(`key`, `001`, `value 001`);
     * memoryCache.add(`key`, `001`, { name: 'name 001' });
     * memoryCache.add(`key`, `001`, `value 001`, max);
     */
  listAdd<TValue = string>(key: string, id: string, value: TValue, max: number = 10): void {
    const allItems = this.get<{ id: string; value: TValue }[]>(key) || [];
    const currentItem = allItems.find(item => {
      return item.id === id;
    });
    if (!currentItem) {
      allItems.push({
        id: id,
        value: value
      });
      if (allItems.length > max) {
        allItems.splice(0, 1);
      }
    } else {
      currentItem.value = value;
    }
    this.set(key, allItems);
  }
  /**
     * get item from list
     * @example
     * memoryCache.get(`key`, `001`);
     */
  listGet<TValue>(key: string, id: string): TValue {
    const allItems = this.get<{ id: string; value: TValue }[]>(key) || [];
    const currentItem = allItems.find(item => {
      return item.id === id;
    });
    if (currentItem) {
      return currentItem.value;
    } else {
      return null as any;
    }
  }
  size() {
    return memoryStorage.size;
  }
}

const memoryCache = new MemoryCache();
export { memoryCache };
