import { useState } from "react";
import type { Movie } from "../../types/Movie.type";
import { useMovieDetails } from "../../hooks/movie/useMovieDetails";
import { Modal } from "../shared/modal/Modal";
import { MovieDetails } from "./movie-details/MovieDetails";
import { Loader } from "../shared/loader/Loader";

export const MovieCard = ({ movie }: { movie: Movie }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getMovieDetailsHook, movieDetails, loading, error } =
    useMovieDetails();

  const handleClick = async () => {
    setIsModalOpen(true);
    await getMovieDetailsHook(movie.imdbID);
    console.log(movieDetails);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const hasValidPoster = (poster: string) => poster && poster !== "N/A";

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="w-full h-64 bg-gray-200 flex items-center justify-center overflow-hidden">
          {hasValidPoster(movie.Poster) ? (
            <img
              src={movie.Poster}
              alt={movie.Title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
          ) : null}
          <div 
            className={`w-full h-full flex flex-col items-center justify-center text-gray-500 ${hasValidPoster(movie.Poster) ? 'hidden' : 'flex'}`}
          >
            <svg className="w-16 h-16 mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">Image non disponible</span>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2">{movie.Title}</h3>
          <p className="text-gray-600 mb-1">{movie.Year}</p>
          <p className="text-gray-500 capitalize mb-4">{movie.Type}</p>

          <button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
            onClick={handleClick}
          >
            Voir les détails
          </button>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={movie.Title}
      >
        <Loader loading={loading} error={error}>
          {movieDetails && <MovieDetails movieDetails={movieDetails} />}
        </Loader>
      </Modal>
    </>
  );
};
