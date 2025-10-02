import type { Movie } from "../types/Movie.type";
import type { MovieDetail } from "../types/Movie.type";
import type { OMDbSearchResponse } from "../types/Omb.type";
import { BASE_URL, API_KEY, BASE_URL_POSTER } from "../utils/constants";
import { NetworkError, ApiError, MovieNotFoundError } from "../utils/errors";

export const searchMovies = async (query: string): Promise<Movie[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      if (response.status >= 500) {
        throw new ApiError();
      }
      throw new ApiError();
    }

    const data: OMDbSearchResponse = await response.json();

    if (data.Response === "False") {
      if (data.Error === "Movie not found!") {
        throw new MovieNotFoundError(query);
      }
      throw new ApiError(data.Error);
    }

    return data.Search || [];
  } catch (error) {
    if (error instanceof NetworkError || error instanceof ApiError || error instanceof MovieNotFoundError) {
      throw error;
    }
    
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new NetworkError();
    }

    throw new ApiError();
  }
};

export const getMovieDetails = async (
  imdbID: string
): Promise<MovieDetail | null> => {
  try {
    const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&i=${imdbID}`);

    if (!response.ok) {
      throw new ApiError();
    }

    const data: MovieDetail = await response.json();
    return data.Response === "True" ? data : null;
  } catch (error) {
    if (error instanceof NetworkError || error instanceof ApiError) {
      throw error;
    }

    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new NetworkError();
    }

    throw new ApiError();
  }
};

export const getMoviePoster = async (imdbID: string): Promise<string> => {
  try {
    const response = await fetch(
      `${BASE_URL_POSTER}?apikey=${API_KEY}&i=${imdbID}`
    );

    if (!response.ok) {
      throw new ApiError();
    }

    const data: MovieDetail = await response.json();
    return data.Poster;
  } catch (error) {
    if (error instanceof NetworkError || error instanceof ApiError) {
      throw error;
    }

    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new NetworkError();
    }

    throw new ApiError();
  }
};