import { memoryCache } from '../src/memory-cache';

describe('memory-cache', () => {
    it('should set \'key1\' value is string', () => {
        memoryCache.set('key1', 'key1-value');
        const value = memoryCache.get('key1');
        expect(value).toBe('key1-value');
    });

    it('should set \'key-object\' value is object', () => {
        const user = { name: 'name1', id: '1' };
        memoryCache.set('key-object', user);
        const value = memoryCache.get<{ name: string; id: string }>('key-object');
        expect(value).toEqual(user);
    });

    it('should has key2 value', () => {
        memoryCache.set('key2', 'key2-value');
        const value = memoryCache.has('key2');
        expect(value).toBe(true);
    });

    it('should remove key2', () => {
        memoryCache.set('key2', 'key2-value');
        memoryCache.remove('key2');
        expect(memoryCache.has('key2')).toBe(false);
    });

    it('should clear all', () => {
        memoryCache.set('key2', 'key2-value');
        memoryCache.clear();
        expect(memoryCache.has('key2')).toBe(false);
    });

    it('should auto remove min hits cache key:\'key:2\'', () => {
        memoryCache.clear();
        for (let i = 1; i <= 1000; i++) {
            memoryCache.set(`key:${i}`, `value:${i}`);
            if (i !== 2) {
                memoryCache.get(`key:${i}`);
            }
        }
        expect(memoryCache.has('key:2')).toBe(true);
        memoryCache.set('key:10001', 'value:10001');
        expect(memoryCache.has('key:2')).toBe(false);
    });

    it('should add item to list', () => {
        memoryCache.listAdd('test', '001', 'hello');
        const list = memoryCache.get<{ id: string; value: string }[]>('test');
        expect(list).toEqual([
            {
                id: '001',
                value: 'hello'
            }
        ]);
    });

    it('should add item to list with max', () => {
        const MAX = 4;
        memoryCache.listAdd('key', '001', 'hello1', MAX);
        memoryCache.listAdd('key', '002', 'hello2', MAX);
        memoryCache.listAdd('key', '003', 'hello3', MAX);
        memoryCache.listAdd('key', '004', 'hello4', MAX);
        memoryCache.listAdd('key', '005', 'hello5', MAX);

        const list = memoryCache.get<{ id: string; value: string }[]>('key');

        expect(list).toEqual([
            {
                id: '002',
                value: 'hello2'
            },
            {
                id: '003',
                value: 'hello3'
            },
            {
                id: '004',
                value: 'hello4'
            },
            {
                id: '005',
                value: 'hello5'
            }
        ]);
    });

    it('should get item value from list', () => {
        memoryCache.listAdd('key', '002', 'hello2');
        const result = memoryCache.listGet<string>('key', '002');
        expect(result).toBe('hello2');
    });
});
