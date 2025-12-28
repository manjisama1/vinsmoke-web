import { useData } from '@/contexts/DataContext';

// Simple hook that uses existing DataContext loading state
export const useServerStatus = () => {
  const { loading, error } = useData();

  // Server is online if we're not loading and there's no error
  // Server is offline if there's an error
  // Server is checking if we're currently loading
  const isOnline = !loading && !error;
  const isChecking = loading;
  const isOffline = !loading && !!error;

  return {
    isOnline,
    isOffline,
    isChecking
  };
};