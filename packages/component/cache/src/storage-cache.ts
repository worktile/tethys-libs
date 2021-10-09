import * as LZString from 'lz-string';
import * as lodash from 'lodash';

const _ = lodash;
const NUMBER_PREFIX = '____n____';

const SupportedStorage = window && window.localStorage;
const storageSource = window.localStorage || window.sessionStorage;

const cache = {
  /**
     * set item to local storage
     *
     * @example
     * cache.set('key1', 'key1-value');
     * cache.set('key1', 10);
     * cache.set('key1', { id: 1, name: 'name 1'});
     * cache.set('key1', 'key1-value', false);
     * @param key string
     * @param value string | number | object
     * @param compress compress data default true
     */
  set<TValue = string>(key: string, value: TValue, compress = true) {
    let itemValue = _.isString(value) ? value : _.isNumber(value) ? `${NUMBER_PREFIX}${value}` : JSON.stringify(value);
    if (compress) {
      itemValue = LZString.compressToUTF16(itemValue);
    }
    if (SupportedStorage) {
      storageSource.setItem(key, itemValue as string);
    }
  },
  /**
     * get item from local storage
     *
     * @example
     * cache.get('key1');
     * cache.get<number>('key1');
     * cache.get<User>('key1');
     * cache.get<User[]>('key1');
     * cache.get('key1', false);
     *
     * @param key string
     * @param compress compress data default true
     */
  get<TValue = string>(key: string, compress = true): TValue {
    if (SupportedStorage) {
      let value = storageSource.getItem(key);
      if (value) {
        if (compress) {
          value = LZString.decompressFromUTF16(value);
        }
        try {
          const result = JSON.parse(value as string);
          return result;
        } catch (error) {
          if (_.isString(value) && value.includes(NUMBER_PREFIX)) {
            return parseInt(value.replace(NUMBER_PREFIX, ''), 10) as any;
          } else {
            return value as any;
          }
        }
      } else {
        return undefined as any;
      }
    } else {
      return undefined as any;
    }
  },
  /**
     * remove key from storage
     * @param key cache key
     */
  remove(key: string) {
    if (SupportedStorage) {
      storageSource.removeItem(key);
    }
  },
  /**
     * clear all storage
     */
  clear() {
    if (SupportedStorage) {
      storageSource.clear();
    }
  }
};

export { cache };
