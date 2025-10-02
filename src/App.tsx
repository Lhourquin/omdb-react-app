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
  } = useMovieSearch();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Recherche de Films
      </h1>

      <div className="mb-6">
        <SearchBar onSearch={searchMoviesHook} searchHistory={searchHistory} />
      </div>

      {lastSearchQuery && movies.length > 0 && !loading && (
        <div className="mb-4 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-lg">
            <svg
              className="w-4 h-4"
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
            <span className="text-sm">
              Résultats de la dernière recherche :{" "}
              <span className="font-semibold">"{lastSearchQuery}"</span>
            </span>
          </div>
        </div>
      )}

      <MovieList movies={movies} loading={loading} error={error} />
    </div>
  );
}

export default App;
