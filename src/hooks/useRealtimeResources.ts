import useSWR from 'swr';
import { SHARED_RESOURCES } from '../data/havahData';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useRealtimeResources() {
  const { data, error } = useSWR('/api/resources', fetcher, {
    fallbackData: SHARED_RESOURCES,
    refreshInterval: 1000 * 60 * 5, // Revalidate every 5 minutes
  });

  return {
    resources: data || SHARED_RESOURCES,
    isLoading: !error && !data,
    isError: error,
  };
}
