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
      const result = getCachedSearch('test', 1);
      expect(result).toBeNull();
    });

    it('should return null for non-existent query', () => {
      setCachedSearch('matrix', 1, mockMovies, 10);
      
      const result = getCachedSearch('inception', 1);
      expect(result).toBeNull();
    });

    it('should return null for different page', () => {
      setCachedSearch('test', 1, mockMovies, 20);
      
      const result = getCachedSearch('test', 2);
      expect(result).toBeNull();
    });

    it('should return cached results for exact match with page', () => {
      setCachedSearch('test', 1, mockMovies, 10);
      
      const result = getCachedSearch('test', 1);
      expect(result).toEqual({ results: mockMovies, totalResults: 10 });
    });

    it('should cache different pages separately', () => {
      const movies1 = [mockMovie];
      const movies2 = [{ ...mockMovie, Title: 'Another Movie' }];
      
      setCachedSearch('test', 1, movies1, 20);
      setCachedSearch('test', 2, movies2, 20);
      
      const result1 = getCachedSearch('test', 1);
      const result2 = getCachedSearch('test', 2);
      
      expect(result1?.results).toEqual(movies1);
      expect(result2?.results).toEqual(movies2);
      expect(result1?.totalResults).toBe(20);
      expect(result2?.totalResults).toBe(20);
    });

    it('should be case-insensitive', () => {
      setCachedSearch('Matrix', 1, mockMovies, 10);
      
      const result = getCachedSearch('matrix', 1);
      expect(result).toEqual({ results: mockMovies, totalResults: 10 });
    });

    it('should trim whitespace from query', () => {
      setCachedSearch('  Matrix  ', 1, mockMovies, 10);
      
      const result = getCachedSearch('matrix', 1);
      expect(result).toEqual({ results: mockMovies, totalResults: 10 });
    });

    it('should return null for expired cache entry', () => {
      const now = Date.now();
      vi.setSystemTime(now);
      
      setCachedSearch('test', 1, mockMovies, 10);
      
      // Avancer le temps au-delà de l'expiration
      vi.setSystemTime(now + CACHE_EXPIRATION_MS + 1000);
      
      const result = getCachedSearch('test', 1);
      expect(result).toBeNull();
    });

    it('should return cached results when not expired', () => {
      const now = Date.now();
      vi.setSystemTime(now);
      
      setCachedSearch('test', 1, mockMovies, 10);
      
      // Avancer le temps mais rester dans la période de validité
      vi.setSystemTime(now + CACHE_EXPIRATION_MS - 1000);
      
      const result = getCachedSearch('test', 1);
      expect(result).toEqual({ results: mockMovies, totalResults: 10 });
    });

    it('should remove expired entry from cache', () => {
      const now = Date.now();
      vi.setSystemTime(now);
      
      setCachedSearch('test', 1, mockMovies, 10);
      
      // Vérifier que l'entrée existe
      const cache = getItem<any>(CACHE_KEY);
      expect(cache['test_page1']).toBeDefined();
      
      // Avancer le temps et récupérer (devrait supprimer)
      vi.setSystemTime(now + CACHE_EXPIRATION_MS + 1000);
      getCachedSearch('test', 1);
      
      // Vérifier que l'entrée a été supprimée
      const cacheAfter = getItem<any>(CACHE_KEY);
      expect(cacheAfter['test_page1']).toBeUndefined();
    });
  });

  describe('setCachedSearch', () => {
    it('should cache search results correctly', () => {
      setCachedSearch('test', 1, mockMovies, 10);
      
      const cache = getItem<any>(CACHE_KEY);
      expect(cache).toBeDefined();
      expect(cache['test_page1']).toBeDefined();
      expect(cache['test_page1'].results).toEqual(mockMovies);
      expect(cache['test_page1'].query).toBe('test');
      expect(cache['test_page1'].page).toBe(1);
      expect(cache['test_page1'].totalResults).toBe(10);
    });

    it('should normalize query key (lowercase + trim)', () => {
      setCachedSearch('  MATRIX  ', 1, mockMovies, 10);
      
      const cache = getItem<any>(CACHE_KEY);
      expect(cache['matrix_page1']).toBeDefined();
      expect(cache['matrix_page1'].results).toEqual(mockMovies);
    });

    it('should store timestamp and accessOrder', () => {
      const now = Date.now();
      vi.setSystemTime(now);
      
      setCachedSearch('test', 1, mockMovies, 10);
      
      const cache = getItem<any>(CACHE_KEY);
      expect(cache['test_page1'].timestamp).toBe(now);
      expect(cache['test_page1'].accessOrder).toBeDefined();
      expect(typeof cache['test_page1'].accessOrder).toBe('number');
    });

    it('should not cache results exceeding MAX_RESULTS_TO_CACHE', () => {
      const bigResults = Array(MAX_RESULTS_TO_CACHE + 1).fill(mockMovie);
      
      setCachedSearch('test', 1, bigResults, 100);
      
      const result = getCachedSearch('test', 1);
      expect(result).toBeNull();
    });

    it('should cache results at MAX_RESULTS_TO_CACHE limit', () => {
      const maxResults = Array(MAX_RESULTS_TO_CACHE).fill(mockMovie);
      
      setCachedSearch('test', 1, maxResults, 20);
      
      const result = getCachedSearch('test', 1);
      expect(result).toEqual({ results: maxResults, totalResults: 20 });
    });

    it('should update existing cache entry', () => {
      const movies1: Movie[] = [mockMovie];
      const movies2: Movie[] = [{ ...mockMovie, Title: 'Updated' }];
      
      setCachedSearch('test', 1, movies1, 10);
      setCachedSearch('test', 1, movies2, 15);
      
      const result = getCachedSearch('test', 1);
      expect(result).toEqual({ results: movies2, totalResults: 15 });
    });

    it('should limit cache to 50 entries', () => {
      // Créer 51 entrées
      for (let i = 0; i < 51; i++) {
        vi.setSystemTime(Date.now() + i); // Chaque entrée a un timestamp différent
        setCachedSearch(`query${i}`, 1, mockMovies, 10);
      }
      
      const cache = getItem<any>(CACHE_KEY);
      expect(Object.keys(cache).length).toBe(50);
    });

    it('should keep most recent entries when limiting to 50', () => {
      // Créer 51 entrées avec des timestamps croissants
      for (let i = 0; i < 51; i++) {
        vi.setSystemTime(Date.now() + i * 1000);
        setCachedSearch(`query${i}`, 1, mockMovies, 10);
      }
      
      const cache = getItem<any>(CACHE_KEY);
      
      // L'entrée la plus ancienne (query0_page1) devrait être supprimée
      expect(cache['query0_page1']).toBeUndefined();
      
      // L'entrée la plus récente (query50_page1) devrait être présente
      expect(cache['query50_page1']).toBeDefined();
    });

    it('should handle empty results array', () => {
      setCachedSearch('test', 1, [], 0);
      
      const result = getCachedSearch('test', 1);
      expect(result).toEqual({ results: [], totalResults: 0 });
    });

    it('should enforce FIFO limit of 5 pages per query', () => {
      // Ajouter 6 pages pour la même recherche
      for (let i = 1; i <= 6; i++) {
        setCachedSearch('batman', i, mockMovies, 60);
      }
      
      const cache = getItem<any>(CACHE_KEY);
      
      // La première page (page 1) devrait être supprimée
      expect(cache['batman_page1']).toBeUndefined();
      
      // Les pages 2-6 devraient être présentes
      expect(cache['batman_page2']).toBeDefined();
      expect(cache['batman_page3']).toBeDefined();
      expect(cache['batman_page4']).toBeDefined();
      expect(cache['batman_page5']).toBeDefined();
      expect(cache['batman_page6']).toBeDefined();
    });

    it('should maintain separate FIFO limits for different queries', () => {
      // Ajouter 5 pages pour "batman"
      for (let i = 1; i <= 5; i++) {
        setCachedSearch('batman', i, mockMovies, 50);
      }
      
      // Ajouter 3 pages pour "matrix"
      for (let i = 1; i <= 3; i++) {
        setCachedSearch('matrix', i, mockMovies, 30);
      }
      
      const cache = getItem<any>(CACHE_KEY);
      
      // Vérifier que batman a 5 pages
      const batmanPages = Object.keys(cache).filter(k => k.startsWith('batman_page'));
      expect(batmanPages.length).toBe(5);
      
      // Vérifier que matrix a 3 pages
      const matrixPages = Object.keys(cache).filter(k => k.startsWith('matrix_page'));
      expect(matrixPages.length).toBe(3);
    });

    it('should remove oldest page based on accessOrder not timestamp', () => {
      // Créer des pages avec des timestamps différents
      vi.setSystemTime(1000);
      setCachedSearch('test', 1, mockMovies, 50);
      
      vi.setSystemTime(2000);
      setCachedSearch('test', 2, mockMovies, 50);
      
      vi.setSystemTime(3000);
      setCachedSearch('test', 3, mockMovies, 50);
      
      vi.setSystemTime(4000);
      setCachedSearch('test', 4, mockMovies, 50);
      
      vi.setSystemTime(5000);
      setCachedSearch('test', 5, mockMovies, 50);
      
      // Accéder à la page 1 pour mettre à jour son timestamp
      vi.setSystemTime(6000);
      getCachedSearch('test', 1);
      
      // Ajouter une 6ème page
      vi.setSystemTime(7000);
      setCachedSearch('test', 6, mockMovies, 50);
      
      const cache = getItem<any>(CACHE_KEY);
      
      // La page 1 devrait toujours être supprimée malgré son timestamp récent
      // car elle a le plus petit accessOrder
      expect(cache['test_page1']).toBeUndefined();
      expect(cache['test_page6']).toBeDefined();
    });

    it('should increment accessOrder for each new cache entry', () => {
      setCachedSearch('test1', 1, mockMovies, 10);
      setCachedSearch('test2', 1, mockMovies, 10);
      setCachedSearch('test3', 1, mockMovies, 10);
      
      const cache = getItem<any>(CACHE_KEY);
      
      const order1 = cache['test1_page1'].accessOrder;
      const order2 = cache['test2_page1'].accessOrder;
      const order3 = cache['test3_page1'].accessOrder;
      
      expect(order2).toBeGreaterThan(order1);
      expect(order3).toBeGreaterThan(order2);
    });
  });

  describe('removeCachedSearch', () => {
    it('should remove specific cache entry with page', () => {
      setCachedSearch('test1', 1, mockMovies, 10);
      setCachedSearch('test2', 1, mockMovies, 10);
      
      removeCachedSearch('test1', 1);
      
      expect(getCachedSearch('test1', 1)).toBeNull();
      expect(getCachedSearch('test2', 1)).toEqual({ results: mockMovies, totalResults: 10 });
    });

    it('should remove all pages for a query when page is not specified', () => {
      setCachedSearch('test', 1, mockMovies, 20);
      setCachedSearch('test', 2, mockMovies, 20);
      setCachedSearch('other', 1, mockMovies, 10);
      
      removeCachedSearch('test');
      
      expect(getCachedSearch('test', 1)).toBeNull();
      expect(getCachedSearch('test', 2)).toBeNull();
      expect(getCachedSearch('other', 1)).toEqual({ results: mockMovies, totalResults: 10 });
    });

    it('should handle removing non-existent entry', () => {
      expect(() => {
        removeCachedSearch('nonExistent', 1);
      }).not.toThrow();
    });

    it('should handle removing from empty cache', () => {
      expect(() => {
        removeCachedSearch('test', 1);
      }).not.toThrow();
    });

    it('should normalize query key when removing', () => {
      setCachedSearch('Matrix', 1, mockMovies, 10);
      
      removeCachedSearch('  MATRIX  ', 1);
      
      expect(getCachedSearch('matrix', 1)).toBeNull();
    });
  });

  describe('clearSearchCache', () => {
    it('should clear all cache entries', () => {
      setCachedSearch('test1', 1, mockMovies, 10);
      setCachedSearch('test2', 1, mockMovies, 10);
      setCachedSearch('test3', 1, mockMovies, 10);
      
      clearSearchCache();
      
      expect(getCachedSearch('test1', 1)).toBeNull();
      expect(getCachedSearch('test2', 1)).toBeNull();
      expect(getCachedSearch('test3', 1)).toBeNull();
    });

    it('should handle clearing empty cache', () => {
      expect(() => {
        clearSearchCache();
      }).not.toThrow();
    });

    it('should create empty cache object', () => {
      setCachedSearch('test', 1, mockMovies, 10);
      
      clearSearchCache();
      
      const cache = getItem<any>(CACHE_KEY);
      expect(cache).toEqual({});
    });
  });

  describe('Integration scenarios', () => {
    it('should handle complete cache lifecycle', () => {
      // Set
      setCachedSearch('test', 1, mockMovies, 10);
      expect(getCachedSearch('test', 1)).toEqual({ results: mockMovies, totalResults: 10 });
      
      // Update
      const updatedMovies = [{ ...mockMovie, Title: 'Updated' }];
      setCachedSearch('test', 1, updatedMovies, 15);
      expect(getCachedSearch('test', 1)).toEqual({ results: updatedMovies, totalResults: 15 });
      
      // Remove
      removeCachedSearch('test', 1);
      expect(getCachedSearch('test', 1)).toBeNull();
    });

    it('should handle multiple concurrent cache entries', () => {
      const movies1 = [{ ...mockMovie, imdbID: 'tt1' }];
      const movies2 = [{ ...mockMovie, imdbID: 'tt2' }];
      const movies3 = [{ ...mockMovie, imdbID: 'tt3' }];
      
      setCachedSearch('query1', 1, movies1, 10);
      setCachedSearch('query2', 1, movies2, 10);
      setCachedSearch('query3', 1, movies3, 10);
      
      expect(getCachedSearch('query1', 1)).toEqual({ results: movies1, totalResults: 10 });
      expect(getCachedSearch('query2', 1)).toEqual({ results: movies2, totalResults: 10 });
      expect(getCachedSearch('query3', 1)).toEqual({ results: movies3, totalResults: 10 });
    });

    it('should handle mixed operations', () => {
      setCachedSearch('keep1', 1, mockMovies, 10);
      setCachedSearch('keep2', 1, mockMovies, 10);
      setCachedSearch('remove', 1, mockMovies, 10);
      
      removeCachedSearch('remove', 1);
      
      expect(getCachedSearch('keep1', 1)).toEqual({ results: mockMovies, totalResults: 10 });
      expect(getCachedSearch('keep2', 1)).toEqual({ results: mockMovies, totalResults: 10 });
      expect(getCachedSearch('remove', 1)).toBeNull();
    });
  });

  describe('Edge cases', () => {
    it('should handle very long query strings', () => {
      const longQuery = 'a'.repeat(1000);
      setCachedSearch(longQuery, 1, mockMovies, 10);
      
      expect(getCachedSearch(longQuery, 1)).toEqual({ results: mockMovies, totalResults: 10 });
    });

    it('should handle special characters in query', () => {
      const specialQuery = 'test@#$%^&*()[]{}';
      setCachedSearch(specialQuery, 1, mockMovies, 10);
      
      expect(getCachedSearch(specialQuery, 1)).toEqual({ results: mockMovies, totalResults: 10 });
    });

    it('should handle unicode characters in query', () => {
      const unicodeQuery = '测试 тест テスト';
      setCachedSearch(unicodeQuery, 1, mockMovies, 10);
      
      expect(getCachedSearch(unicodeQuery, 1)).toEqual({ results: mockMovies, totalResults: 10 });
    });
  });
});

