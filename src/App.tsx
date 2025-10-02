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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
            </svg>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CinéSearch
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Découvrez votre prochain film préféré</p>
        </div>

        <div className="mb-8">
          <SearchBar onSearch={searchMoviesHook} searchHistory={searchHistory} />
        </div>

        {lastSearchQuery && movies.length > 0 && !loading && (
          <div className="mb-6 text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 text-blue-700 px-5 py-3 rounded-full shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">
                Résultats pour <span className="font-bold">"{lastSearchQuery}"</span>
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