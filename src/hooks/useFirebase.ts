import {useEffect, useState, useCallback} from 'react';
import FirebaseService from '../firebase';

interface FirebaseState {
  isInitialized: boolean;
  isInitializing: boolean;
  error: Error | null;
}

/**
 * Custom hook for Firebase initialization
 * Ensures Firebase is properly initialized before use
 */
export const useFirebase = () => {
  const [state, setState] = useState<FirebaseState>({
    isInitialized: false,
    isInitializing: false,
    error: null,
  });

  const initialize = useCallback(async () => {
    if (state.isInitialized || state.isInitializing) {
      return;
    }

    setState(prev => ({...prev, isInitializing: true, error: null}));

    try {
      await FirebaseService.initialize();
      setState({
        isInitialized: true,
        isInitializing: false,
        error: null,
      });
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      setState({
        isInitialized: false,
        isInitializing: false,
        error: errorObj,
      });
    }
  }, [state.isInitialized, state.isInitializing]);

  const reset = useCallback(() => {
    FirebaseService.reset();
    setState({
      isInitialized: false,
      isInitializing: false,
      error: null,
    });
  }, []);

  const retry = useCallback(async () => {
    reset();
    await initialize();
  }, [reset, initialize]);

  useEffect(() => {
    // Auto-initialize Firebase when hook is mounted
    initialize();
  }, [initialize]);

  return {
    ...state,
    initialize,
    reset,
    retry,
    isReady: state.isInitialized && !state.isInitializing,
  };
};

export default useFirebase;
