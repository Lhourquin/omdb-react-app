import type { MovieDetail } from "../../../types/Movie.type";

interface MovieDetailRatingsProps {
  ratings: MovieDetail['Ratings'];
}

export const MovieDetailRatings = ({ ratings }: MovieDetailRatingsProps) => {
  if (!ratings || ratings.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
        <h3 className="text-xl font-bold text-white">Évaluations</h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ratings.map((rating, index) => (
            <div
              key={index}
              className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center hover:shadow-md transition-shadow"
            >
              <div className="font-semibold text-gray-700 mb-2 text-sm">
                {rating.Source}
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {rating.Value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};