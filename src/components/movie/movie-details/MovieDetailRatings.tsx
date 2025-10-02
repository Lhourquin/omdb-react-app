import type { MovieDetail } from "../../../types/Movie.type";

interface MovieDetailRatingsProps {
  ratings: MovieDetail['Ratings'];
}

export const MovieDetailRatings = ({ ratings }: MovieDetailRatingsProps) => {
  if (!ratings || ratings.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900">Évaluations</h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ratings.map((rating, index) => (
            <div
              key={index}
              className="bg-gray-50 p-5 rounded-xl border border-gray-200 text-center hover:border-gray-300 transition-colors"
            >
              <div className="font-semibold text-gray-600 mb-2 text-xs uppercase tracking-wide">
                {rating.Source}
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {rating.Value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};