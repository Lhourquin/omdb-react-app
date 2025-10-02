import "./App.css";
import { MovieList } from "./components/movie/MovieList";
import { SearchBar } from "./components/shared/searchbar/SearchBar";
import { useMovieSearch } from "./hooks/movie/useMovieSearch";

function App() {
  const {
    movies,
    loading,
    error,
    searchHistory,
    lastSearchQuery,
    searchMoviesHook,
    removeFromHistory,
  } = useMovieSearch();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <SearchBar
            onSearch={searchMoviesHook}
            searchHistory={searchHistory}
            onDeleteHistoryItem={removeFromHistory}
          />
        </div>

        {lastSearchQuery && movies.length > 0 && !loading && (
          <div className="mb-6 text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-3 rounded-lg shadow-sm">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm font-medium">
                Résultats pour{" "}
                <span className="font-bold">"{lastSearchQuery}"</span>
              </span>
            </div>
          </div>
        )}

        <MovieList movies={movies} loading={loading} error={error} />
      </div>
    </div>
  );
}

export default App;
