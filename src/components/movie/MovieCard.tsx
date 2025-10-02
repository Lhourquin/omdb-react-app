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
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const hasValidPoster = (poster: string) => poster && poster !== "N/A";

  return (
    <>
      <div className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-gray-100">
        <div className="relative w-full h-80 bg-gray-100 overflow-hidden">
          {hasValidPoster(movie.Poster) ? (
            <img
              src={movie.Poster}
              alt={movie.Title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
          ) : null}
          <div 
            className={`absolute inset-0 flex flex-col items-center justify-center text-gray-500 ${hasValidPoster(movie.Poster) ? 'hidden' : 'flex'}`}
          >
            <svg className="w-20 h-20 mb-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">Image non disponible</span>
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              className="w-full bg-white text-gray-900 font-semibold px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors shadow-lg flex items-center justify-center gap-2"
              onClick={handleClick}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Voir les détails
            </button>
          </div>
        </div>

        <div className="p-5">
          <h3 className="font-bold text-xl mb-2 text-gray-900 line-clamp-2 min-h-[3.5rem]">
            {movie.Title}
          </h3>
          <div className="flex items-center justify-between text-sm">
            <span className="inline-flex items-center gap-1 text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {movie.Year}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 capitalize">
              {movie.Type}
            </span>
          </div>
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