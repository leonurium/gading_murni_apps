import React, {createContext, useContext, ReactNode} from 'react';
import useFirebase from '../hooks/useFirebase';

interface FirebaseContextType {
  isInitialized: boolean;
  isInitializing: boolean;
  error: Error | null;
  isReady: boolean;
  initialize: () => Promise<void>;
  reset: () => void;
  retry: () => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

interface FirebaseProviderProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error) => void;
}

/**
 * Firebase Provider Component
 * Wraps the app and ensures Firebase is properly initialized
 */
export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({
  children,
  fallback,
  onError,
}) => {
  const firebaseState = useFirebase();

  // Call onError callback when there's an error
  React.useEffect(() => {
    if (firebaseState.error && onError) {
      onError(firebaseState.error);
    }
  }, [firebaseState.error, onError]);

  // Show fallback while initializing
  if (firebaseState.isInitializing) {
    return fallback ? <>{fallback}</> : null;
  }

  // Show fallback if initialization failed
  if (firebaseState.error) {
    return fallback ? <>{fallback}</> : null;
  }

  // Only render children when Firebase is ready
  if (!firebaseState.isReady) {
    return fallback ? <>{fallback}</> : null;
  }

  return (
    <FirebaseContext.Provider value={firebaseState}>
      {children}
    </FirebaseContext.Provider>
  );
};

/**
 * Hook to use Firebase context
 */
export const useFirebaseContext = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebaseContext must be used within a FirebaseProvider');
  }
  return context;
};

export default FirebaseProvider;
