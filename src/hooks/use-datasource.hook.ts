import type { DataSource } from "lam-frontend/api";
import { useCallback, useEffect, useState } from "react";

export function useDataSourceHook<T>(
    dataResource: DataSource<T> | null,
    options?: { enabled?: boolean }
) {
    const enabled = options?.enabled ?? true;
    const [loading, setLoading] = useState(!!dataResource && enabled);
    const [data, setData] = useState<T>();
    const [error, setError] = useState<string | null>(null);

    const invalidate = useCallback(async () => {
        if (!dataResource) return;

        setLoading(true);
        setError(null);

        try {
            await dataResource?.invalidate();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Invalidation failed');
        } finally {
            setLoading(false);
        }
    }, [dataResource])

    useEffect(() => {
        if (!enabled || !dataResource) {
            setLoading(false);
            return;
        }

        setLoading(true);

        const unsubscribe = dataResource?.subscribe(
            (data) => {
                setData(data);
                setLoading(false);
                setError(null);
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
