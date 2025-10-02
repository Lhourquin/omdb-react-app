import type { MovieDetail } from "../../../types/Movie.type";
import { MovieDetailHeader } from "./MovieDetailHeader";
import { MovieDetailPlot } from "./MovieDetailPlot";
import { MovieDetailInformation } from "./MovieDetailInformation";
import { MovieDetailRatings } from "./MovieDetailRatings";

interface MovieDetailsProps {
  movieDetails: MovieDetail;
}

export const MovieDetails = ({ movieDetails }: MovieDetailsProps) => {
  return (
    <div className="space-y-8">
      <MovieDetailHeader movieDetails={movieDetails} />
      <MovieDetailPlot plot={movieDetails.Plot} />
      <MovieDetailInformation movieDetails={movieDetails} />
      <MovieDetailRatings ratings={movieDetails.Ratings} />
    </div>
  );
};