import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
  getCachedSearch,
  setCachedSearch,
  removeCachedSearch,
  clearSearchCache,
  CACHE_KEY,
  CACHE_EXPIRATION_MS,
  MAX_RESULTS_TO_CACHE,
} from '../../services/cache.service';
import { getItem } from '../../services/localstorage.service';
import type { Movie } from '../../types/Movie.type';

const mockMovie: Movie = {
  Title: 'Inception',
  Year: '2010',
  imdbID: 'tt1375666',
  Type: 'movie',
  Poster: 'https://example.com/poster.jpg',
};

const mockMovies: Movie[] = [mockMovie];

describe('Cache Service', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('getCachedSearch', () => {
    it('should return null when cache is empty', () => {
      const result = getCachedSearch('test');
      expect(result).toBeNull();
    });

    it('should return null for non-existent query', () => {
      setCachedSearch('matrix', mockMovies);
      
      const result = getCachedSearch('inception');
      expect(result).toBeNull();
    });

    it('should return cached results for exact match', () => {
      setCachedSearch('test', mockMovies);
      
      const result = getCachedSearch('test');
      expect(result).toEqual(mockMovies);
    });

    it('should be case-insensitive', () => {
      setCachedSearch('Matrix', mockMovies);
      
      const result = getCachedSearch('matrix');
      expect(result).toEqual(mockMovies);
    });

    it('should trim whitespace from query', () => {
      setCachedSearch('  Matrix  ', mockMovies);
      
      const result = getCachedSearch('matrix');
      expect(result).toEqual(mockMovies);
    });

    it('should return null for expired cache entry', () => {
      const now = Date.now();
      vi.setSystemTime(now);
      
      setCachedSearch('test', mockMovies);
      
      // Avancer le temps au-delà de l'expiration
      vi.setSystemTime(now + CACHE_EXPIRATION_MS + 1000);
      
      const result = getCachedSearch('test');
      expect(result).toBeNull();
    });

    it('should return cached results when not expired', () => {
      const now = Date.now();
      vi.setSystemTime(now);
      
      setCachedSearch('test', mockMovies);
      
      // Avancer le temps mais rester dans la période de validité
      vi.setSystemTime(now + CACHE_EXPIRATION_MS - 1000);
      
      const result = getCachedSearch('test');
      expect(result).toEqual(mockMovies);
    });

    it('should remove expired entry from cache', () => {
      const now = Date.now();
      vi.setSystemTime(now);
      
      setCachedSearch('test', mockMovies);
      
      // Vérifier que l'entrée existe
      const cache = getItem<any>(CACHE_KEY);
      expect(cache['test']).toBeDefined();
      
      // Avancer le temps et récupérer (devrait supprimer)
      vi.setSystemTime(now + CACHE_EXPIRATION_MS + 1000);
      getCachedSearch('test');
      
      // Vérifier que l'entrée a été supprimée
      const cacheAfter = getItem<any>(CACHE_KEY);
      expect(cacheAfter['test']).toBeUndefined();
    });
  });

  describe('setCachedSearch', () => {
    it('should cache search results correctly', () => {
      setCachedSearch('test', mockMovies);
      
      const cache = getItem<any>(CACHE_KEY);
      expect(cache).toBeDefined();
      expect(cache['test']).toBeDefined();
      expect(cache['test'].results).toEqual(mockMovies);
      expect(cache['test'].query).toBe('test');
    });

    it('should normalize query key (lowercase + trim)', () => {
      setCachedSearch('  MATRIX  ', mockMovies);
      
      const cache = getItem<any>(CACHE_KEY);
      expect(cache['matrix']).toBeDefined();
      expect(cache['matrix'].results).toEqual(mockMovies);
    });

    it('should store timestamp', () => {
      const now = Date.now();
      vi.setSystemTime(now);
      
      setCachedSearch('test', mockMovies);
      
      const cache = getItem<any>(CACHE_KEY);
      expect(cache['test'].timestamp).toBe(now);
    });

    it('should not cache results exceeding MAX_RESULTS_TO_CACHE', () => {
      const bigResults = Array(MAX_RESULTS_TO_CACHE + 1).fill(mockMovie);
      
      setCachedSearch('test', bigResults);
      
      const result = getCachedSearch('test');
      expect(result).toBeNull();
    });

    it('should cache results at MAX_RESULTS_TO_CACHE limit', () => {
      const maxResults = Array(MAX_RESULTS_TO_CACHE).fill(mockMovie);
      
      setCachedSearch('test', maxResults);
      
      const result = getCachedSearch('test');
      expect(result).toEqual(maxResults);
    });

    it('should update existing cache entry', () => {
      const movies1: Movie[] = [mockMovie];
      const movies2: Movie[] = [{ ...mockMovie, Title: 'Updated' }];
      
      setCachedSearch('test', movies1);
      setCachedSearch('test', movies2);
      
      const result = getCachedSearch('test');
      expect(result).toEqual(movies2);
    });

    it('should limit cache to 50 entries', () => {
      // Créer 51 entrées
      for (let i = 0; i < 51; i++) {
        vi.setSystemTime(Date.now() + i); // Chaque entrée a un timestamp différent
        setCachedSearch(`query${i}`, mockMovies);
      }
      
      const cache = getItem<any>(CACHE_KEY);
      expect(Object.keys(cache).length).toBe(50);
    });

    it('should keep most recent entries when limiting to 50', () => {
      // Créer 51 entrées avec des timestamps croissants
      for (let i = 0; i < 51; i++) {
        vi.setSystemTime(Date.now() + i * 1000);
        setCachedSearch(`query${i}`, mockMovies);
      }
      
      const cache = getItem<any>(CACHE_KEY);
      
      // L'entrée la plus ancienne (query0) devrait être supprimée
      expect(cache['query0']).toBeUndefined();
      
      // L'entrée la plus récente (query50) devrait être présente
      expect(cache['query50']).toBeDefined();
    });

    it('should handle empty results array', () => {
      setCachedSearch('test', []);
      
      const result = getCachedSearch('test');
      expect(result).toEqual([]);
    });
  });

  describe('removeCachedSearch', () => {
    it('should remove specific cache entry', () => {
      setCachedSearch('test1', mockMovies);
      setCachedSearch('test2', mockMovies);
      
      removeCachedSearch('test1');
      
      expect(getCachedSearch('test1')).toBeNull();
      expect(getCachedSearch('test2')).toEqual(mockMovies);
    });

    it('should handle removing non-existent entry', () => {
      expect(() => {
        removeCachedSearch('nonExistent');
      }).not.toThrow();
    });

    it('should handle removing from empty cache', () => {
      expect(() => {
        removeCachedSearch('test');
      }).not.toThrow();
    });

    it('should normalize query key when removing', () => {
      setCachedSearch('Matrix', mockMovies);
      
      removeCachedSearch('  MATRIX  ');
      
      expect(getCachedSearch('matrix')).toBeNull();
    });
  });

  describe('clearSearchCache', () => {
    it('should clear all cache entries', () => {
      setCachedSearch('test1', mockMovies);
      setCachedSearch('test2', mockMovies);
      setCachedSearch('test3', mockMovies);
      
      clearSearchCache();
      
      expect(getCachedSearch('test1')).toBeNull();
      expect(getCachedSearch('test2')).toBeNull();
      expect(getCachedSearch('test3')).toBeNull();
    });

    it('should handle clearing empty cache', () => {
      expect(() => {
        clearSearchCache();
      }).not.toThrow();
    });

    it('should create empty cache object', () => {
      setCachedSearch('test', mockMovies);
      
      clearSearchCache();
      
      const cache = getItem<any>(CACHE_KEY);
      expect(cache).toEqual({});
    });
  });

  describe('Integration scenarios', () => {
    it('should handle complete cache lifecycle', () => {
      // Set
      setCachedSearch('test', mockMovies);
      expect(getCachedSearch('test')).toEqual(mockMovies);
      
      // Update
      const updatedMovies = [{ ...mockMovie, Title: 'Updated' }];
      setCachedSearch('test', updatedMovies);
      expect(getCachedSearch('test')).toEqual(updatedMovies);
      
      // Remove
      removeCachedSearch('test');
      expect(getCachedSearch('test')).toBeNull();
    });

    it('should handle multiple concurrent cache entries', () => {
      const movies1 = [{ ...mockMovie, imdbID: 'tt1' }];
      const movies2 = [{ ...mockMovie, imdbID: 'tt2' }];
      const movies3 = [{ ...mockMovie, imdbID: 'tt3' }];
      
      setCachedSearch('query1', movies1);
      setCachedSearch('query2', movies2);
      setCachedSearch('query3', movies3);
      
      expect(getCachedSearch('query1')).toEqual(movies1);
      expect(getCachedSearch('query2')).toEqual(movies2);
      expect(getCachedSearch('query3')).toEqual(movies3);
    });

    it('should handle mixed operations', () => {
      setCachedSearch('keep1', mockMovies);
      setCachedSearch('keep2', mockMovies);
      setCachedSearch('remove', mockMovies);
      
      removeCachedSearch('remove');
      
      expect(getCachedSearch('keep1')).toEqual(mockMovies);
      expect(getCachedSearch('keep2')).toEqual(mockMovies);
      expect(getCachedSearch('remove')).toBeNull();
    });
  });

  describe('Edge cases', () => {
    it('should handle very long query strings', () => {
      const longQuery = 'a'.repeat(1000);
      setCachedSearch(longQuery, mockMovies);
      
      expect(getCachedSearch(longQuery)).toEqual(mockMovies);
    });

    it('should handle special characters in query', () => {
      const specialQuery = 'test@#$%^&*()[]{}';
      setCachedSearch(specialQuery, mockMovies);
      
      expect(getCachedSearch(specialQuery)).toEqual(mockMovies);
    });

    it('should handle unicode characters in query', () => {
      const unicodeQuery = '测试 тест テスト';
      setCachedSearch(unicodeQuery, mockMovies);
      
      expect(getCachedSearch(unicodeQuery)).toEqual(mockMovies);
    });
  });
});

