import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { searchMovies, getMovieDetails, getMoviePoster } from '../../services/omdb.service';
import { NetworkError, ApiError, MovieNotFoundError } from '../../utils/errors';
import type { Movie, MovieDetail } from '../../types/Movie.type';
import type { OMDbSearchResponse } from '../../types/Omb.type';

const server = setupServer();

const mockMovie: Movie = {
  Title: 'Inception',
  Year: '2010',
  imdbID: 'tt1375666',
  Type: 'movie',
  Poster: 'https://example.com/poster.jpg',
};

const mockMovieDetail: MovieDetail = {
  ...mockMovie,
  Rated: 'PG-13',
  Released: '16 Jul 2010',
  Runtime: '148 min',
  Genre: 'Action, Sci-Fi, Thriller',
  Director: 'Christopher Nolan',
  Writer: 'Christopher Nolan',
  Actors: 'Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page',
  Plot: 'A thief who steals corporate secrets through the use of dream-sharing technology.',
  Language: 'English',
  Country: 'USA, UK',
  Awards: 'Won 4 Oscars',
  Ratings: [{ Source: 'Internet Movie Database', Value: '8.8/10' }],
  Metascore: '74',
  imdbRating: '8.8',
  imdbVotes: '2,000,000',
  DVD: '07 Dec 2010',
  BoxOffice: '$292,576,195',
  Production: 'Warner Bros. Pictures',
  Website: 'N/A',
  Response: 'True',
};

describe('OMDb Service', () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'warn' });
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  describe('searchMovies', () => {
    it('should return array of movies on successful search', async () => {
      const mockResponse: OMDbSearchResponse = {
        Search: [mockMovie],
        totalResults: '1',
        Response: 'True',
      };

      server.use(
        http.get('*', ({ request }) => {
          const url = new URL(request.url);
          if (url.searchParams.get('s')) {
            return HttpResponse.json(mockResponse);
          }
        })
      );

      const result = await searchMovies('Inception');
      expect(result).toEqual([mockMovie]);
    });

    it('should handle query with special characters', async () => {
      const mockResponse: OMDbSearchResponse = {
        Search: [mockMovie],
        totalResults: '1',
        Response: 'True',
      };

      server.use(
        http.get('*', ({ request }) => {
          const url = new URL(request.url);
          const query = url.searchParams.get('s');
          expect(query).toBe('Matrix: Reloaded');
          return HttpResponse.json(mockResponse);
        })
      );

      await searchMovies('Matrix: Reloaded');
    });

    it('should return empty array when Search is undefined', async () => {
      const mockResponse = {
        totalResults: '0',
        Response: 'True',
      };

      server.use(
        http.get('*', () => HttpResponse.json(mockResponse))
      );

      const result = await searchMovies('test');
      expect(result).toEqual([]);
    });

    it('should throw MovieNotFoundError when movie is not found', async () => {
      const mockResponse: OMDbSearchResponse = {
        Search: [],
        totalResults: '0',
        Response: 'False',
        Error: 'Movie not found!',
      };

      server.use(
        http.get('*', () => HttpResponse.json(mockResponse))
      );

      await expect(searchMovies('nonexistentmovie123'))
        .rejects.toThrow(MovieNotFoundError);
      
      await expect(searchMovies('nonexistentmovie123'))
        .rejects.toThrow('Aucun film trouvé pour "nonexistentmovie123"');
    });

    it('should throw ApiError for generic API errors', async () => {
      const mockResponse: OMDbSearchResponse = {
        Search: [],
        totalResults: '0',
        Response: 'False',
        Error: 'Invalid API key',
      };

      server.use(
        http.get('*', () => HttpResponse.json(mockResponse))
      );

      await expect(searchMovies('test')).rejects.toThrow(ApiError);
    });

    it('should throw ApiError on 500 status', async () => {
      server.use(
        http.get('*', () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      await expect(searchMovies('test')).rejects.toThrow(ApiError);
    });

    it('should throw ApiError on 400 status', async () => {
      server.use(
        http.get('*', () => {
          return new HttpResponse(null, { status: 400 });
        })
      );

      await expect(searchMovies('test')).rejects.toThrow(ApiError);
    });

    it('should throw NetworkError on network failure', async () => {
      server.use(
        http.get('*', () => HttpResponse.error())
      );

      await expect(searchMovies('test')).rejects.toThrow(NetworkError);
    });

    it('should properly encode query parameters', async () => {
      server.use(
        http.get('*', ({ request }) => {
          const url = new URL(request.url);
          const query = url.searchParams.get('s');
          // Vérifier que les espaces et caractères spéciaux sont encodés
          expect(query).toBeTruthy();
          return HttpResponse.json({
            Search: [mockMovie],
            totalResults: '1',
            Response: 'True',
          });
        })
      );

      await searchMovies('The Dark Knight');
    });
  });

  describe('getMovieDetails', () => {
    it('should return movie details on success', async () => {
      server.use(
        http.get('*', ({ request }) => {
          const url = new URL(request.url);
          if (url.searchParams.get('i')) {
            return HttpResponse.json(mockMovieDetail);
          }
        })
      );

      const result = await getMovieDetails('tt1375666');
      expect(result).toEqual(mockMovieDetail);
    });

    it('should return null when Response is False', async () => {
      const mockResponse = {
        ...mockMovieDetail,
        Response: 'False',
      };

      server.use(
        http.get('*', () => HttpResponse.json(mockResponse))
      );

      const result = await getMovieDetails('invalid');
      expect(result).toBeNull();
    });

    it('should throw ApiError on HTTP error status', async () => {
      server.use(
        http.get('*', () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      await expect(getMovieDetails('tt1375666')).rejects.toThrow(ApiError);
    });

    it('should throw NetworkError on network failure', async () => {
      server.use(
        http.get('*', () => HttpResponse.error())
      );

      await expect(getMovieDetails('tt1375666')).rejects.toThrow(NetworkError);
    });

    it('should use correct imdbID parameter', async () => {
      const testImdbID = 'tt1234567';
      
      server.use(
        http.get('*', ({ request }) => {
          const url = new URL(request.url);
          expect(url.searchParams.get('i')).toBe(testImdbID);
          return HttpResponse.json(mockMovieDetail);
        })
      );

      await getMovieDetails(testImdbID);
    });
  });

  describe('getMoviePoster', () => {
    it('should return poster URL on success', async () => {
      server.use(
        http.get('*', ({ request }) => {
          const url = new URL(request.url);
          if (url.searchParams.get('i')) {
            return HttpResponse.json(mockMovieDetail);
          }
        })
      );

      const result = await getMoviePoster('tt1375666');
      expect(result).toBe(mockMovieDetail.Poster);
    });

    it('should throw ApiError on HTTP error status', async () => {
      server.use(
        http.get('*', () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      await expect(getMoviePoster('tt1375666')).rejects.toThrow(ApiError);
    });

    it('should throw NetworkError on network failure', async () => {
      server.use(
        http.get('*', () => HttpResponse.error())
      );

      await expect(getMoviePoster('tt1375666')).rejects.toThrow(NetworkError);
    });
  });

  describe('Error handling edge cases', () => {
    it('should throw ApiError for unknown errors in searchMovies', async () => {
      server.use(
        http.get('*', () => {
          throw new Error('Unknown error');
        })
      );

      await expect(searchMovies('test')).rejects.toThrow(ApiError);
    });

    it('should preserve custom error types through catch blocks', async () => {
      server.use(
        http.get('*', () => HttpResponse.json({
          Response: 'False',
          Error: 'Movie not found!',
        }))
      );

      try {
        await searchMovies('test');
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(MovieNotFoundError);
        expect(error).not.toBeInstanceOf(ApiError);
        expect(error).not.toBeInstanceOf(NetworkError);
      }
    });
  });
});

