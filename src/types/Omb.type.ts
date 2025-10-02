import type { Movie } from "./Movie.type";
export interface OMDbSearchResponse {
  Search: Movie[];
  totalResults: string;
  Response: "True" | "False";
  Error?: string;
}

export interface SearchState {
  query: string;
  results: Movie[];
  loading: boolean;
  error: string | null;
}
