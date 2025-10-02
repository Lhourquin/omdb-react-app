import { useState, useCallback, useEffect } from "react";
import { searchMovies } from "../../services/omdb.service";
import { getCachedSearch, setCachedSearch } from "../../services/cache.service";
import type { Movie as MovieType } from "../../types/Movie.type";
import { useLoader } from "../loader/useLoader";
import { useLocalStorage } from "../localStorage/useLocalStorage";
import { MovieNotFoundError } from "../../utils/errors";

const SEARCH_HISTORY_KEY = "searchHistory";
const MAX_HISTORY_SIZE = 10;

export const useMovieSearch = () => {
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [searchHistory, setSearchHistory] = useLocalStorage<string[]>(SEARCH_HISTORY_KEY, []);
  const [isCachedResult, setIsCachedResult] = useState(false);
  const [lastSearchQuery, setLastSearchQuery] = useState<string | null>(null);
  const loader = useLoader("Recherche en cours...");

  const searchMoviesHook = useCallback(async (query: string, isInitialLoad = false) => {
    if (!query.trim()) return;

    const cachedResults = getCachedSearch(query);
    
    if (cachedResults) {
      setMovies(cachedResults);
      setIsCachedResult(true);
      setLastSearchQuery(query);
      
      if (!isInitialLoad) {
        setSearchHistory((prev) => {
          const newHistory = [query, ...prev.filter(q => q !== query)].slice(0, MAX_HISTORY_SIZE);
          return newHistory;
        });
      }
      
      return;
    }

    setIsCachedResult(false);
    loader.startLoading("Recherche en cours...");
    
    try {
      const results = await searchMovies(query);
      setMovies(results);
      setLastSearchQuery(query);
      
      setCachedSearch(query, results);

      if (!isInitialLoad) {
        setSearchHistory((prev) => {
          const newHistory = [query, ...prev.filter(q => q !== query)].slice(0, MAX_HISTORY_SIZE);
          return newHistory;
        });
      }

      loader.stopLoading();
    } catch (error) {
      setMovies([]);
      setLastSearchQuery(null);
      
      if (error instanceof MovieNotFoundError) {
        loader.setError(error.message);
      } else {
        loader.setError(error instanceof Error ? error.message : "Erreur de recherche");
      }
    }
  }, [loader, setSearchHistory]);

  const removeFromHistory = useCallback((queryToRemove: string) => {
    setSearchHistory((prev) => prev.filter(q => q !== queryToRemove));
  }, [setSearchHistory]);

  useEffect(() => {
    if (searchHistory.length > 0) {
      const lastQuery = searchHistory[0];
      searchMoviesHook(lastQuery, true);
    }
  }, []);

  return {
    movies,
    loading: loader.loading,
    error: loader.error,
    searchHistory,
    isCachedResult,
    lastSearchQuery,
    searchMoviesHook,
    removeFromHistory,
  };
};