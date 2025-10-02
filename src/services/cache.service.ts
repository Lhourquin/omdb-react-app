import { getItem, setItem } from "./localstorage.service";
import type { Movie } from "../types/Movie.type";

const CACHE_KEY = "movieSearchCache";
const CACHE_EXPIRATION_MS = 1000 * 60 * 60; // 1 heure
const MAX_RESULTS_TO_CACHE = 20;

interface CacheEntry {
  query: string;
  results: Movie[];
  timestamp: number;
}

interface SearchCache {
  [key: string]: CacheEntry;
}

const getCacheKey = (query: string): string => {
  return query.toLowerCase().trim();
};

export const getCachedSearch = (query: string): Movie[] | null => {
  const cache = getItem<SearchCache>(CACHE_KEY);
  if (!cache) return null;

  const key = getCacheKey(query);
  const entry = cache[key];

  if (!entry) return null;

  const isExpired = Date.now() - entry.timestamp > CACHE_EXPIRATION_MS;
  if (isExpired) {
    removeCachedSearch(query);
    return null;
  }

  return entry.results;
};

export const setCachedSearch = (query: string, results: Movie[]): void => {
  if (results.length > MAX_RESULTS_TO_CACHE) {
    return;
  }

  const cache = getItem<SearchCache>(CACHE_KEY) || {};
  const key = getCacheKey(query);

  cache[key] = {
    query,
    results,
    timestamp: Date.now(),
  };

  const cacheEntries = Object.values(cache);
  if (cacheEntries.length > 50) {
    const sortedEntries = cacheEntries.sort(
      (a, b) => b.timestamp - a.timestamp
    );
    const newCache: SearchCache = {};
    sortedEntries.slice(0, 50).forEach((entry) => {
      newCache[getCacheKey(entry.query)] = entry;
    });
    setItem(CACHE_KEY, newCache);
  } else {
    setItem(CACHE_KEY, cache);
  }
};

export const removeCachedSearch = (query: string): void => {
  const cache = getItem<SearchCache>(CACHE_KEY);
  if (!cache) return;

  const key = getCacheKey(query);
  delete cache[key];
  setItem(CACHE_KEY, cache);
};

export const clearSearchCache = (): void => {
  setItem(CACHE_KEY, {});
};
