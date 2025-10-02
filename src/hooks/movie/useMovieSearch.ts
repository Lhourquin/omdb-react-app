import { useState, useCallback } from "react";
import { searchMovies } from "../../services/omdb.service";
import { getCachedSearch, setCachedSearch } from "../../services/cache.service";
import type { Movie as MovieType } from "../../types/Movie.type";
import { useLoader } from "../loader/useLoader";
import { useLocalStorage } from "../localStorage/useLocalStorage";

const SEARCH_HISTORY_KEY = "searchHistory";
const MAX_HISTORY_SIZE = 10;

export const useMovieSearch = () => {
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [searchHistory, setSearchHistory] = useLocalStorage<string[]>(SEARCH_HISTORY_KEY, []);
  const [isCachedResult, setIsCachedResult] = useState(false);
  const loader = useLoader("Recherche en cours...");

  const searchMoviesHook = useCallback(async (query: string) => {
    if (!query.trim()) return;

    const cachedResults = getCachedSearch(query);
    
    if (cachedResults) {
      setMovies(cachedResults);
      setIsCachedResult(true);
      
      setSearchHistory((prev) => {
        const newHistory = [query, ...prev.filter(q => q !== query)].slice(0, MAX_HISTORY_SIZE);
        return newHistory;
      });
      
      return;
    }

    setIsCachedResult(false);
    loader.startLoading("Recherche en cours...");
    
    try {
      const results = await searchMovies(query);
      setMovies(results);
      
      setCachedSearch(query, results);

      setSearchHistory((prev) => {
        const newHistory = [query, ...prev.filter(q => q !== query)].slice(0, MAX_HISTORY_SIZE);
        return newHistory;
      });

      loader.stopLoading();
    } catch (error) {
      loader.setError(error instanceof Error ? error.message : "Erreur de recherche");
    }
  }, [loader, setSearchHistory]);

  return {
    movies,
    loading: loader.loading,
    error: loader.error,
    searchHistory,
    isCachedResult,
    searchMoviesHook,
  };
};