// hooks/useApiData.ts
import { useState, useEffect } from "react";

type useFetchDataReturn<T> = {
  data: T | null;
  loading: boolean;
  error: unknown;
};

export const useFetchData = <T>( fetchFn: () => Promise<T>, dependencies: any[] = [] ): useFetchDataReturn<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetchFn();
        if (isMounted) setData(res);
      } catch (err) {
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, dependencies);

  return { data, loading, error };
};
