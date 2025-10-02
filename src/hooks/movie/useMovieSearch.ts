import { useState, useCallback, useEffect } from "react";
import { searchMovies } from "../../services/omdb.service";
import { getCachedSearch, setCachedSearch, removeCachedSearch } from "../../services/cache.service";
import type { Movie as MovieType } from "../../types/Movie.type";
import { useLoader } from "../loader/useLoader";
import { useLocalStorage } from "../localStorage/useLocalStorage";
import { MovieNotFoundError } from "../../utils/errors";

const SEARCH_HISTORY_KEY = "searchHistory";
const LAST_PAGE_KEY = "lastPageByQuery";
const MAX_HISTORY_SIZE = 10;

export const useMovieSearch = () => {
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [searchHistory, setSearchHistory] = useLocalStorage<string[]>(SEARCH_HISTORY_KEY, []);
  const [lastPageByQuery, setLastPageByQuery] = useLocalStorage<Record<string, number>>(LAST_PAGE_KEY, {});
  const [isCachedResult, setIsCachedResult] = useState(false);
  const [lastSearchQuery, setLastSearchQuery] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const loader = useLoader("Recherche en cours...");

  const searchMoviesHook = useCallback(
    async (query: string, page: number = 1, isInitialLoad = false) => {
      if (!query.trim()) return;

      const cachedResults = getCachedSearch(query, page);

      if (cachedResults) {
        setMovies(cachedResults.results);
        setTotalResults(cachedResults.totalResults);
        setCurrentPage(page);
        setIsCachedResult(true);
        setLastSearchQuery(query);

        // Persister la page courante
        setLastPageByQuery((prev) => ({ ...prev, [query]: page }));

        if (!isInitialLoad) {
          setSearchHistory((prev) => {
            const newHistory = [query, ...prev.filter((q) => q !== query)].slice(
              0,
              MAX_HISTORY_SIZE
            );
            return newHistory;
          });
        }

        return;
      }

      setIsCachedResult(false);
      loader.startLoading("Recherche en cours...");

      try {
        const { movies: results, totalResults: total } = await searchMovies(query, page);
        setMovies(results);
        setTotalResults(total);
        setCurrentPage(page);
        setLastSearchQuery(query);

        setCachedSearch(query, page, results, total);

        // Persister la page courante
        setLastPageByQuery((prev) => ({ ...prev, [query]: page }));

        if (!isInitialLoad) {
          setSearchHistory((prev) => {
            const newHistory = [query, ...prev.filter((q) => q !== query)].slice(
              0,
              MAX_HISTORY_SIZE
            );
            return newHistory;
          });
        }

        loader.stopLoading();
      } catch (error) {
        setMovies([]);
        setTotalResults(0);
        setCurrentPage(1);
        setLastSearchQuery(null);

        if (error instanceof MovieNotFoundError) {
          loader.setError(error.message);
        } else {
          loader.setError(
            error instanceof Error ? error.message : "Erreur de recherche"
          );
        }
      }
    },
    [loader, setSearchHistory, setLastPageByQuery]
  );

  const removeFromHistory = useCallback((queryToRemove: string) => {
    setSearchHistory((prev) => prev.filter(q => q !== queryToRemove));
    setLastPageByQuery((prev) => {
      const newMap = { ...prev };
      delete newMap[queryToRemove];
      return newMap;
    });
    removeCachedSearch(queryToRemove);
  }, [setSearchHistory, setLastPageByQuery]);

  const goToPage = useCallback(
    (page: number) => {
      if (lastSearchQuery && page > 0) {
        searchMoviesHook(lastSearchQuery, page);
      }
    },
    [lastSearchQuery, searchMoviesHook]
  );

  useEffect(() => {
    if (searchHistory.length > 0) {
      const lastQuery = searchHistory[0];
      // Récupérer la dernière page consultée pour cette recherche
      const savedPage = lastPageByQuery[lastQuery] || 1;
      searchMoviesHook(lastQuery, savedPage, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    movies,
    loading: loader.loading,
    error: loader.error,
    searchHistory,
    isCachedResult,
    lastSearchQuery,
    currentPage,
    totalResults,
    totalPages: Math.ceil(totalResults / 10),
    searchMoviesHook,
    removeFromHistory,
    goToPage,
  };
};