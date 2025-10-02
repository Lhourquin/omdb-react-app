import { getItem, setItem } from "./localstorage.service";
import type { Movie } from "../types/Movie.type";

export const CACHE_KEY = "movieSearchCache";
export const CACHE_EXPIRATION_MS = 1000 * 60 * 60; // 1 heure
export const MAX_RESULTS_TO_CACHE = 20;

export interface CacheEntry {
  query: string;
  page: number;
  results: Movie[];
  totalResults: number;
  timestamp: number;
}

export interface SearchCache {
  [key: string]: CacheEntry;
}

const getCacheKey = (query: string, page: number): string => {
  return `${query.toLowerCase().trim()}_page${page}`;
};

export const getCachedSearch = (
  query: string,
  page: number
): { results: Movie[]; totalResults: number } | null => {
  const cache = getItem<SearchCache>(CACHE_KEY);
  if (!cache) return null;

  const key = getCacheKey(query, page);
  const entry = cache[key];

  if (!entry) return null;

  const isExpired = Date.now() - entry.timestamp > CACHE_EXPIRATION_MS;
  if (isExpired) {
    removeCachedSearch(query, page);
    return null;
  }

  return {
    results: entry.results,
    totalResults: entry.totalResults,
  };
};

export const setCachedSearch = (
  query: string,
  page: number,
  results: Movie[],
  totalResults: number
): void => {
  if (results.length > MAX_RESULTS_TO_CACHE) {
    return;
  }

  const cache = getItem<SearchCache>(CACHE_KEY) || {};
  const key = getCacheKey(query, page);

  cache[key] = {
    query,
    page,
    results,
    totalResults,
    timestamp: Date.now(),
  };

  const cacheEntries = Object.values(cache);
  if (cacheEntries.length > 50) {
    const sortedEntries = cacheEntries.sort(
      (a, b) => b.timestamp - a.timestamp
    );
    const newCache: SearchCache = {};
    sortedEntries.slice(0, 50).forEach((entry) => {
      newCache[getCacheKey(entry.query, entry.page)] = entry;
    });
    setItem(CACHE_KEY, newCache);
  } else {
    setItem(CACHE_KEY, cache);
  }
};

export const removeCachedSearch = (query: string, page?: number): void => {
  const cache = getItem<SearchCache>(CACHE_KEY);
  if (!cache) return;

  if (page !== undefined) {
    const key = getCacheKey(query, page);
    delete cache[key];
  } else {
    Object.keys(cache).forEach((key) => {
      if (cache[key].query.toLowerCase().trim() === query.toLowerCase().trim()) {
        delete cache[key];
      }
    });
  }
  
  setItem(CACHE_KEY, cache);
};

export const clearSearchCache = (): void => {
  setItem(CACHE_KEY, {});
};
