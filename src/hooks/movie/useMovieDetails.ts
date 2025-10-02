import { useState } from "react";
import type { MovieDetail } from "../../types/Movie.type";
import { getMovieDetails } from "../../services/omdb.service";
import { useLoader } from "../loader/useLoader";

export const useMovieDetails = () => {
  const [movieDetails, setMovieDetails] = useState<MovieDetail | null>(null);
  const loader = useLoader("Chargement des détails...");

  const getMovieDetailsHook = async (imdbID: string) => {
    loader.startLoading("Chargement des détails...");
    try {
      const movieDetails = await getMovieDetails(imdbID);
      setMovieDetails(movieDetails);
      loader.stopLoading();
      return movieDetails;
    } catch (error) {
      loader.setError(error as string);
    }
  };

  return { 
    movieDetails, 
    getMovieDetailsHook, 
    loading: loader.loading, 
    error: loader.error 
  };
};
