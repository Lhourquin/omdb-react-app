import { describe, it, expect } from 'vitest';
import { NetworkError, ApiError, MovieNotFoundError } from '../../utils/errors';

describe('Custom Error Classes', () => {
  describe('NetworkError', () => {
    it('should create error with correct name and default message', () => {
      const error = new NetworkError();
      
      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('NetworkError');
      expect(error.message).toBe('Problème de connexion internet. Veuillez vérifier votre connexion.');
    });

    it('should accept custom message', () => {
      const customMessage = 'Connection timeout';
      const error = new NetworkError(customMessage);
      
      expect(error.name).toBe('NetworkError');
      expect(error.message).toBe(customMessage);
    });

    it('should be throwable and catchable', () => {
      expect(() => {
        throw new NetworkError();
      }).toThrow(NetworkError);
    });
  });

  describe('ApiError', () => {
    it('should create error with correct name and default message', () => {
      const error = new ApiError();
      
      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('ApiError');
      expect(error.message).toBe('Oups, nous rencontrons un problème. Veuillez réessayer ultérieurement.');
    });

    it('should accept custom message', () => {
      const customMessage = 'API rate limit exceeded';
      const error = new ApiError(customMessage);
      
      expect(error.name).toBe('ApiError');
      expect(error.message).toBe(customMessage);
    });

    it('should be throwable and catchable', () => {
      expect(() => {
        throw new ApiError('Custom error');
      }).toThrow(ApiError);
    });
  });

  describe('MovieNotFoundError', () => {
    it('should create error with correct name and interpolated query', () => {
      const query = 'Inception';
      const error = new MovieNotFoundError(query);
      
      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('MovieNotFoundError');
      expect(error.message).toBe(`Aucun film trouvé pour "${query}".`);
    });

    it('should handle empty query string', () => {
      const error = new MovieNotFoundError('');
      
      expect(error.message).toBe('Aucun film trouvé pour "".');
    });

    it('should handle special characters in query', () => {
      const query = 'Matrix: Reloaded "test"';
      const error = new MovieNotFoundError(query);
      
      expect(error.message).toBe(`Aucun film trouvé pour "${query}".`);
    });

    it('should be throwable and catchable', () => {
      expect(() => {
        throw new MovieNotFoundError('NonExistentMovie');
      }).toThrow(MovieNotFoundError);
    });
  });

  describe('Error inheritance', () => {
    it('all custom errors should inherit from Error', () => {
      expect(new NetworkError()).toBeInstanceOf(Error);
      expect(new ApiError()).toBeInstanceOf(Error);
      expect(new MovieNotFoundError('test')).toBeInstanceOf(Error);
    });

    it('errors should be distinguishable via instanceof', () => {
      const networkError = new NetworkError();
      const apiError = new ApiError();
      const movieNotFoundError = new MovieNotFoundError('test');

      expect(networkError).toBeInstanceOf(NetworkError);
      expect(networkError).not.toBeInstanceOf(ApiError);
      expect(networkError).not.toBeInstanceOf(MovieNotFoundError);

      expect(apiError).toBeInstanceOf(ApiError);
      expect(apiError).not.toBeInstanceOf(NetworkError);
      expect(apiError).not.toBeInstanceOf(MovieNotFoundError);

      expect(movieNotFoundError).toBeInstanceOf(MovieNotFoundError);
      expect(movieNotFoundError).not.toBeInstanceOf(NetworkError);
      expect(movieNotFoundError).not.toBeInstanceOf(ApiError);
    });
  });
});

