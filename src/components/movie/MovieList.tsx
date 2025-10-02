import { MovieCard } from "./MovieCard";
import type { Movie } from "../../types/Movie.type";
import { Loader } from "../shared/loader/Loader";

interface MovieListProps {
  movies: Movie[];
  loading?: boolean;
  error?: string | null;
}

export const MovieList = ({ movies, loading = false, error = null }: MovieListProps) => {
  return (
    <Loader loading={loading} error={error}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 px-4 sm:px-0">
        {movies.map((movie) => (
          <MovieCard key={movie.imdbID} movie={movie} />
        ))}
      </div>
    </Loader>
  );
};
