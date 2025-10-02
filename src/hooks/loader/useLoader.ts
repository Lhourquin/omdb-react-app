import { useState, useCallback } from 'react';

export interface LoaderState {
  loading: boolean;
  error: string | null;
  message: string;
}

export const useLoader = (initialMessage = '') => {
  const [state, setState] = useState<LoaderState>({
    loading: false,
    error: null,
    message: initialMessage,
  });

  const startLoading = useCallback((message?: string) => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
      message: message || prev.message,
    }));
  }, []);

  const stopLoading = useCallback(() => {
    setState(prev => ({
      ...prev,
      loading: false,
    }));
  }, []);

  const setError = useCallback((error: string) => {
    setState(prev => ({
      ...prev,
      loading: false,
      error,
    }));
  }, []);

  const setMessage = useCallback((message: string) => {
    setState(prev => ({
      ...prev,
      message,
    }));
  }, []);

  const reset = useCallback(() => {
    setState({
      loading: false,
      error: null,
      message: initialMessage,
    });
  }, [initialMessage]);

  return {
    ...state,
    startLoading,
    stopLoading,
    setError,
    setMessage,
    reset,
  };
};
