import { useCallback, useRef, useState } from "react";

interface UsePollingOptions<T> {
  fetcher: () => Promise<T>;
  interval?: number;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface UsePollingReturn<T> {
  data: T | null;
  loading: boolean;
  error: string;
  refresh: () => void;
  start: () => void;
  stop: () => void;
}

export function usePolling<T>({
  fetcher,
  interval = 20000,
  onSuccess,
  onError,
}: UsePollingOptions<T>): UsePollingReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const intervalRef = useRef<number | null>(null);
  const mountedRef = useRef(true);

  const execute = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await fetcher();

      if (!mountedRef.current) return;

      setData(result);
      onSuccess?.(result);
    } catch (err) {
      if (!mountedRef.current) return;

      const errorMessage = (err as Error).message;
      setError(errorMessage);
      onError?.(err as Error);
      console.error("Polling error:", err);
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [fetcher, onSuccess, onError]);

  const start = useCallback(() => {
    execute();

    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }

    intervalRef.current = window.setInterval(execute, interval);
  }, [execute, interval]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const refresh = useCallback(() => {
    execute();
  }, [execute]);

  return { data, loading, error, refresh, start, stop };
}
