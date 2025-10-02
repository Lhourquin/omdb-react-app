import type { MovieDetail } from "../../../types/Movie.type";

interface MovieDetailHeaderProps {
  movieDetails: MovieDetail;
}

export const MovieDetailHeader = ({ movieDetails }: MovieDetailHeaderProps) => {
  const hasValidPoster = (poster: string) => poster && poster !== "N/A";

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      <div className="w-full lg:w-80 flex-shrink-0">
        <div className="w-full h-[480px] bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden shadow-xl">
          {hasValidPoster(movieDetails.Poster) ? (
            <img
              src={movieDetails.Poster}
              alt={movieDetails.Title}
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
            className={`w-full h-full flex flex-col items-center justify-center text-gray-500 ${hasValidPoster(movieDetails.Poster) ? 'hidden' : 'flex'}`}
          >
            <svg className="w-24 h-24 mb-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">Image non disponible</span>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {movieDetails.Title}
        </h1>
        
        <div className="flex flex-wrap gap-3 mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {movieDetails.Year}
          </span>
          
          {movieDetails.Runtime !== "N/A" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {movieDetails.Runtime}
            </span>
          )}
          
          {movieDetails.Rated !== "N/A" && (
            <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
              {movieDetails.Rated}
            </span>
          )}
        </div>

        {movieDetails.Genre !== "N/A" && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Genres</h3>
            <div className="flex flex-wrap gap-2">
              {movieDetails.Genre.split(', ').map((genre, index) => (
                <span key={index} className="px-3 py-1 bg-gray-900 text-white rounded-full text-sm font-medium">
                  {genre}
                </span>
              ))}
            </div>
          </div>
        )}

        {movieDetails.imdbRating !== "N/A" && (
          <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <div>
                <div className="text-2xl font-bold text-gray-900">{movieDetails.imdbRating}</div>
                <div className="text-xs text-gray-500">IMDb</div>
              </div>
            </div>
            
            {movieDetails.Metascore !== "N/A" && (
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 bg-gray-900 text-white rounded-lg flex items-center justify-center font-bold text-lg">
                  {movieDetails.Metascore}
                </div>
                <div className="text-xs text-gray-500">Metascore</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};