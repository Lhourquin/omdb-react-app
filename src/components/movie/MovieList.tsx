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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.imdbID} movie={movie} />
        ))}
      </div>
    </Loader>
  );
};
