import type { DataSource } from "lam-frontend/api";
import { useCallback, useEffect, useState } from "react";

export function useDataSourceHook<T>(
  dataResource: DataSource<T> | null,
  options?: { enabled?: boolean }
) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<T>();
  const [error, setError] = useState<string | null>(null);
  const enabled = options?.enabled ?? true;

  const invalidate = useCallback(() => {
    setLoading(true);
    setError(null);
    dataResource?.invalidate();
    setLoading(false);
  }, [dataResource])

  useEffect(() => {
    if (!enabled) return;
    
    const unsubscribe = dataResource?.subscribe(
      (data) => {
        setData(data);
        setLoading(false);
      }, 
      (reason) => {
        setError(reason);
        setLoading(false);
      }
    );

    return () => unsubscribe?.();
  }, [setData, setError, setLoading, dataResource, enabled]);

  return {
    isLoading: loading,
    data: data,
    error: error,
    invalidate: invalidate
  }
}
