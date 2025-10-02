import "./App.css";
import { MovieList } from "./components/movie/MovieList";
import { SearchBar } from "./components/shared/searchbar/SearchBar";
import { useMovieSearch } from "./hooks/movie/useMovieSearch";

function App() {
  const { movies, loading, error, searchHistory, searchMoviesHook } =
    useMovieSearch();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Recherche de Films
      </h1>

      <div className="mb-6">
        <SearchBar onSearch={searchMoviesHook} searchHistory={searchHistory} />
      </div>

      <MovieList movies={movies} loading={loading} error={error} />
    </div>
  );
}

export default App;
