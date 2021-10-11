import { cache } from '../src/storage-cache';
const NUMBER_PREFIX = '____n____';

describe('#cache', () => {
  describe('#set', () => {
    it('should get \'value for test local data\' when storage string', () => {
      const value = 'value for test local data';
      cache.set('key', value);
      const result = localStorage.getItem('key');
      expect(result).toEqual(value);
    });

    it('should get 10 when storage number 10', () => {
      cache.set('key', 10);
      const result = localStorage.getItem('key');
      expect(result).toEqual(`${NUMBER_PREFIX}10`);
    });

    it('should get object when storage object', () => {
      const value = { name: 'name1', age: 12 };
      cache.set('key', value);
      const result = localStorage.getItem('key');
      expect(result).toEqual(JSON.stringify(value));
    });

    it('should get array when storage array', () => {
      const value = [{ name: 'name1', age: 12 }, { name: 'name2', age: 13 }];
      cache.set('key', value);
      const result = localStorage.getItem('key');
      expect(result).toEqual(JSON.stringify(value));
    });

    it('set string without compress', () => {
      const value = 'value for test local data';
      cache.set('key', value);
      const result = localStorage.getItem('key');
      expect(result).toEqual(value);
    });

    it('set number 10 without compress', () => {
      const value = 10;
      cache.set('key', value);
      const result = localStorage.getItem('key');
      expect(result).toEqual(`${NUMBER_PREFIX}10`);
    });
  });

  describe('#get', () => {
    interface User {
      name: string;
      age: number;
    }

    it('should get \'value for test local data\' when storage string', () => {
      const value = 'value for test local data';
      cache.set('key', value);
      const result = cache.get('key');
      expect(result).toEqual(result);
    });

    it('should get \'value for test local data\' when storage string without compress', () => {
      const value = 'value for test local data';
      cache.set('key', value);
      const result = cache.get('key');
      expect(result).toEqual(result);
    });

    it('should get number 10 when storage number 10', () => {
      cache.set('key', 10);
      const result = cache.get<number>('key');
      expect(result).toEqual(10);
    });

    it('should get number 10 when storage number 10 without compress', () => {
      cache.set('key1', 10);
      const result = cache.get<number>('key1');
      expect(result).toEqual(10);
    });

    it('should get object when storage object', () => {
      const value = { name: 'name1', age: 12 };
      cache.set('key', value);
      const result = cache.get<User>('key');
      expect(result).toEqual(value);
    });

    it('should get string 10 when storage string 10', () => {
      cache.set('key', '10');
      const result = cache.get<number>('key');
      expect(result).toEqual(10);
    });

    it('should get array when storage array', () => {
      const value = [{ name: 'name1', age: 12 }, { name: 'name2', age: 13 }];
      cache.set('key', value);
      const result = cache.get<User[]>('key');
      expect(result).toEqual(value);
    });
  });

  describe('#remove', () => {
    it('remove key: key1', () => {
      cache.set('key1', 'key1-value');
      expect(cache.get('key1')).toEqual('key1-value');
      cache.remove('key1');
      expect(cache.get('key1')).toEqual(undefined);
    });
  });

  describe('#clear', () => {
    it('clear keys: key1, key2', () => {
      cache.set('key1', 'key1-value');
      cache.set('key2', 'key2-value');
      expect(cache.get('key1')).toEqual('key1-value');
      expect(cache.get('key2')).toEqual('key2-value');
      cache.clear();
      expect(cache.get('key1')).toEqual(undefined);
      expect(cache.get('key2')).toEqual(undefined);
    });
  });
});
