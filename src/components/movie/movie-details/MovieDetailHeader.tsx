import type { MovieDetail } from "../../../types/Movie.type";

interface MovieDetailHeaderProps {
  movieDetails: MovieDetail;
}

export const MovieDetailHeader = ({ movieDetails }: MovieDetailHeaderProps) => {
  const hasValidPoster = (poster: string) => poster && poster !== "N/A";

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {hasValidPoster(movieDetails.Poster) ? (
        <img
          src={movieDetails.Poster}
          alt={movieDetails.Title}
          className="w-full lg:w-80 h-96 object-cover rounded-xl shadow-lg"
        />
      ) : (
        <div className="w-full lg:w-80 h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-gray-500 text-center text-sm">
            Image non disponible
          </span>
        </div>
      )}

      <div className="flex-1">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {movieDetails.Title}
        </h1>
        <p className="text-xl text-gray-600">
          {movieDetails.Year}
        </p>
      </div>
    </div>
  );
};