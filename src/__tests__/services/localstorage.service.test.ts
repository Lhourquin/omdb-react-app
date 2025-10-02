import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setItem, getItem, removeItem } from '../../services/localstorage.service';

describe('LocalStorage Service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('setItem', () => {
    it('should store string value correctly', () => {
      setItem('testKey', 'testValue');
      
      const stored = localStorage.getItem('testKey');
      expect(stored).toBe('"testValue"');
    });

    it('should store object value as JSON', () => {
      const testObject = { name: 'Test', value: 123 };
      setItem('testKey', testObject);
      
      const stored = localStorage.getItem('testKey');
      expect(stored).toBe(JSON.stringify(testObject));
    });

    it('should store array value as JSON', () => {
      const testArray = [1, 2, 3, 'test'];
      setItem('testKey', testArray);
      
      const stored = localStorage.getItem('testKey');
      expect(stored).toBe(JSON.stringify(testArray));
    });

    it('should handle null value', () => {
      setItem('testKey', null);
      
      const stored = localStorage.getItem('testKey');
      expect(stored).toBe('null');
    });

    it('should handle boolean values', () => {
      setItem('testKey', true);
      
      const stored = localStorage.getItem('testKey');
      expect(stored).toBe('true');
    });
  });

  describe('getItem', () => {
    it('should retrieve and parse stored string', () => {
      localStorage.setItem('testKey', '"testValue"');
      
      const result = getItem<string>('testKey');
      expect(result).toBe('testValue');
    });

    it('should retrieve and parse stored object', () => {
      const testObject = { name: 'Test', value: 123 };
      localStorage.setItem('testKey', JSON.stringify(testObject));
      
      const result = getItem<typeof testObject>('testKey');
      expect(result).toEqual(testObject);
    });

    it('should retrieve and parse stored array', () => {
      const testArray = [1, 2, 3, 'test'];
      localStorage.setItem('testKey', JSON.stringify(testArray));
      
      const result = getItem<typeof testArray>('testKey');
      expect(result).toEqual(testArray);
    });

    it('should return null for non-existent key', () => {
      const result = getItem('nonExistentKey');
      expect(result).toBeNull();
    });

    it('should return null for invalid JSON', () => {
      localStorage.setItem('testKey', '{invalid json}');
      
      const result = getItem('testKey');
      expect(result).toBeNull();
    });

    it('should log error and return null when parsing fails', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      localStorage.setItem('testKey', 'invalid{json');
      
      const result = getItem('testKey');
      
      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Error reading from localStorage'));
      
      consoleErrorSpy.mockRestore();
    });
  });

  describe('removeItem', () => {
    it('should remove existing item', () => {
      localStorage.setItem('testKey', '"testValue"');
      expect(localStorage.getItem('testKey')).not.toBeNull();
      
      removeItem('testKey');
      
      expect(localStorage.getItem('testKey')).toBeNull();
    });

    it('should not throw error when removing non-existent key', () => {
      expect(() => {
        removeItem('nonExistentKey');
      }).not.toThrow();
    });
  });

  describe('Integration scenarios', () => {
    it('should handle complete set-get-remove cycle', () => {
      const testData = { id: 1, name: 'Test' };
      
      setItem('testKey', testData);
      const retrieved = getItem<typeof testData>('testKey');
      expect(retrieved).toEqual(testData);
      
      removeItem('testKey');
      const afterRemoval = getItem('testKey');
      expect(afterRemoval).toBeNull();
    });

    it('should handle overwriting existing values', () => {
      setItem('testKey', 'firstValue');
      setItem('testKey', 'secondValue');
      
      const result = getItem<string>('testKey');
      expect(result).toBe('secondValue');
    });
  });
});

