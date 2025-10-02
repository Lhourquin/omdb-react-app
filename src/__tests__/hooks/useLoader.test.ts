import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLoader } from '../../hooks/loader/useLoader';

describe('useLoader', () => {
  describe('Initial state', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useLoader());

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.message).toBe('');
    });

    it('should initialize with custom message', () => {
      const { result } = renderHook(() => useLoader('Loading data...'));

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.message).toBe('Loading data...');
    });
  });

  describe('startLoading', () => {
    it('should set loading to true and clear error', () => {
      const { result } = renderHook(() => useLoader());

      act(() => {
        result.current.startLoading();
      });

      expect(result.current.loading).toBe(true);
      expect(result.current.error).toBeNull();
    });

    it('should update message when provided', () => {
      const { result } = renderHook(() => useLoader('Initial'));

      act(() => {
        result.current.startLoading('Processing...');
      });

      expect(result.current.loading).toBe(true);
      expect(result.current.message).toBe('Processing...');
    });

    it('should keep previous message when no message provided', () => {
      const { result } = renderHook(() => useLoader('Initial message'));

      act(() => {
        result.current.startLoading();
      });

      expect(result.current.loading).toBe(true);
      expect(result.current.message).toBe('Initial message');
    });

    it('should clear any existing error', () => {
      const { result } = renderHook(() => useLoader());

      act(() => {
        result.current.setError('Previous error');
      });

      expect(result.current.error).toBe('Previous error');

      act(() => {
        result.current.startLoading();
      });

      expect(result.current.error).toBeNull();
      expect(result.current.loading).toBe(true);
    });
  });

  describe('stopLoading', () => {
    it('should set loading to false', () => {
      const { result } = renderHook(() => useLoader());

      act(() => {
        result.current.startLoading();
      });

      expect(result.current.loading).toBe(true);

      act(() => {
        result.current.stopLoading();
      });

      expect(result.current.loading).toBe(false);
    });

    it('should preserve message and error state', () => {
      const { result } = renderHook(() => useLoader('Test message'));

      act(() => {
        result.current.startLoading();
      });

      act(() => {
        result.current.stopLoading();
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.message).toBe('Test message');
      expect(result.current.error).toBeNull();
    });
  });

  describe('setError', () => {
    it('should set error message and stop loading', () => {
      const { result } = renderHook(() => useLoader());

      act(() => {
        result.current.startLoading();
      });

      act(() => {
        result.current.setError('An error occurred');
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe('An error occurred');
    });

    it('should work when not currently loading', () => {
      const { result } = renderHook(() => useLoader());

      act(() => {
        result.current.setError('An error occurred');
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe('An error occurred');
    });

    it('should preserve message when setting error', () => {
      const { result } = renderHook(() => useLoader('Processing...'));

      act(() => {
        result.current.setError('Failed');
      });

      expect(result.current.message).toBe('Processing...');
      expect(result.current.error).toBe('Failed');
    });
  });

  describe('setMessage', () => {
    it('should update message without affecting loading state', () => {
      const { result } = renderHook(() => useLoader('Initial'));

      act(() => {
        result.current.setMessage('Updated message');
      });

      expect(result.current.message).toBe('Updated message');
      expect(result.current.loading).toBe(false);
    });

    it('should update message while loading', () => {
      const { result } = renderHook(() => useLoader());

      act(() => {
        result.current.startLoading('Loading...');
      });

      act(() => {
        result.current.setMessage('Almost done...');
      });

      expect(result.current.message).toBe('Almost done...');
      expect(result.current.loading).toBe(true);
    });
  });

  describe('reset', () => {
    it('should reset to initial state', () => {
      const { result } = renderHook(() => useLoader('Initial message'));

      act(() => {
        result.current.startLoading('Loading...');
      });

      act(() => {
        result.current.setError('Error occurred');
      });

      act(() => {
        result.current.reset();
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.message).toBe('Initial message');
    });

    it('should reset to empty message when no initial message', () => {
      const { result } = renderHook(() => useLoader());

      act(() => {
        result.current.setMessage('Some message');
      });

      act(() => {
        result.current.reset();
      });

      expect(result.current.message).toBe('');
    });
  });

  describe('Complex state transitions', () => {
    it('should handle loading → error → reset cycle', () => {
      const { result } = renderHook(() => useLoader('Initial'));

      // Start loading
      act(() => {
        result.current.startLoading('Loading data...');
      });
      expect(result.current).toMatchObject({
        loading: true,
        error: null,
        message: 'Loading data...',
      });

      // Error occurs
      act(() => {
        result.current.setError('Failed to load');
      });
      expect(result.current).toMatchObject({
        loading: false,
        error: 'Failed to load',
        message: 'Loading data...',
      });

      // Reset
      act(() => {
        result.current.reset();
      });
      expect(result.current).toMatchObject({
        loading: false,
        error: null,
        message: 'Initial',
      });
    });

    it('should handle loading → success → new loading cycle', () => {
      const { result } = renderHook(() => useLoader());

      // First loading
      act(() => {
        result.current.startLoading('First load');
      });

      act(() => {
        result.current.stopLoading();
      });

      expect(result.current.loading).toBe(false);

      // Second loading
      act(() => {
        result.current.startLoading('Second load');
      });

      expect(result.current).toMatchObject({
        loading: true,
        error: null,
        message: 'Second load',
      });
    });

    it('should handle error → new loading → success', () => {
      const { result } = renderHook(() => useLoader());

      // Error state
      act(() => {
        result.current.setError('Previous error');
      });

      // Retry with loading (should clear error)
      act(() => {
        result.current.startLoading('Retrying...');
      });

      expect(result.current).toMatchObject({
        loading: true,
        error: null,
        message: 'Retrying...',
      });

      // Success
      act(() => {
        result.current.stopLoading();
      });

      expect(result.current).toMatchObject({
        loading: false,
        error: null,
        message: 'Retrying...',
      });
    });
  });

  describe('Function stability', () => {
    it('should maintain function references across renders', () => {
      const { result, rerender } = renderHook(() => useLoader());

      const firstFunctions = {
        startLoading: result.current.startLoading,
        stopLoading: result.current.stopLoading,
        setError: result.current.setError,
        setMessage: result.current.setMessage,
        reset: result.current.reset,
      };

      rerender();

      expect(result.current.startLoading).toBe(firstFunctions.startLoading);
      expect(result.current.stopLoading).toBe(firstFunctions.stopLoading);
      expect(result.current.setError).toBe(firstFunctions.setError);
      expect(result.current.setMessage).toBe(firstFunctions.setMessage);
      expect(result.current.reset).toBe(firstFunctions.reset);
    });
  });
});

