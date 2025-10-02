import type { Movie } from "../types/Movie.type";
import type { MovieDetail } from "../types/Movie.type";
import type { OMDbSearchResponse } from "../types/Omb.type";
import { BASE_URL, API_KEY, BASE_URL_POSTER } from "../utils/constants";

export const searchMovies = async (query: string): Promise<Movie[]> => {
  const response = await fetch(
    `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}`
  );
  const data: OMDbSearchResponse = await response.json();
  return data.Search || [];
};

export const getMovieDetails = async (
  imdbID: string
): Promise<MovieDetail | null> => {
  const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&i=${imdbID}`);
  const data: MovieDetail = await response.json();
  return data.Response === "True" ? data : null;
};

export const getMoviePoster = async (imdbID: string): Promise<string> => {
  const response = await fetch(
    `${BASE_URL_POSTER}?apikey=${API_KEY}&i=${imdbID}`
  );
  const data: MovieDetail = await response.json();
  return data.Poster;
};
