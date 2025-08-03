// hooks/usePostData.ts
import { useState } from 'react';

type UsePostDataReturn<T> = {
  data: T | null;
  loading: boolean;
  error: unknown;
  postData: (postFn: () => Promise<T>) => Promise<void>;
};

export const usePostData = <T>(): UsePostDataReturn<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const postData = async (postFn: () => Promise<T>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await postFn();
      setData(res);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, postData };
};
