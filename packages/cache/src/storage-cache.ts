import { isNumber, isString } from '@tethys/cdk/is';

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
    set<TValue = string>(key: string, value: TValue) {
        let itemValue = isString(value) ? value : isNumber(value) ? `${NUMBER_PREFIX}${value}` : JSON.stringify(value);
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
     */
    get<TValue = string>(key: string): TValue | undefined {
        if (SupportedStorage) {
            let value = storageSource.getItem(key);
            if (value) {
                try {
                    const result = JSON.parse(value as string);
                    return result;
                } catch (error) {
                    if (isString(value) && value.includes(NUMBER_PREFIX)) {
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
