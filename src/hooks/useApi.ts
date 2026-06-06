'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ApiError } from '@/lib/api-client';

// ── Generic data fetching hook ────────────────────────────────
interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useApi<T>(
  fetcher: () => Promise<{ data: T; meta?: Record<string, unknown> }>,
  deps: unknown[] = [],
): UseApiState<T> & { meta: Record<string, unknown> | null } {
  const [data,    setData]    = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [meta,    setMeta]    = useState<Record<string, unknown> | null>(null);
  const mounted = useRef(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      if (!mounted.current) return;
      setData(result.data);
      setMeta(result.meta ?? null);
    } catch (err) {
      if (!mounted.current) return;
      setError(err instanceof ApiError ? err.message : 'An unexpected error occurred');
    } finally {
      if (mounted.current) setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    mounted.current = true;
    load();
    return () => { mounted.current = false; };
  }, [load]);

  return { data, loading, error, meta, refetch: load };
}

// ── Mutation hook (POST / PATCH / DELETE) ─────────────────────
interface UseMutationState<T> {
  mutate:   (body?: unknown) => Promise<T | null>;
  loading:  boolean;
  error:    string | null;
  data:     T | null;
  reset:    () => void;
}

export function useMutation<T>(
  mutator: (body?: unknown) => Promise<{ data: T }>,
  options?: { onSuccess?: (data: T) => void; onError?: (err: string) => void },
): UseMutationState<T> {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const [data,    setData]    = useState<T | null>(null);

  const mutate = useCallback(async (body?: unknown): Promise<T | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await mutator(body);
      setData(result.data);
      options?.onSuccess?.(result.data);
      return result.data;
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Request failed';
      setError(msg);
      options?.onError?.(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [mutator, options]);

  const reset = useCallback(() => { setData(null); setError(null); }, []);

  return { mutate, loading, error, data, reset };
}

// ── Paginated list hook ───────────────────────────────────────
interface PaginatedState<T> {
  items:      T[];
  total:      number;
  page:       number;
  totalPages: number;
  loading:    boolean;
  error:      string | null;
  setPage:    (p: number) => void;
  refetch:    () => void;
}

export function usePaginatedApi<T>(
  fetcher: (page: number) => Promise<{ data: T[]; meta?: Record<string, unknown> }>,
  deps: unknown[] = [],
): PaginatedState<T> {
  const [page,       setPage]       = useState(1);
  const [items,      setItems]      = useState<T[]>([]);
  const [total,      setTotal]      = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState<string | null>(null);
  const mounted = useRef(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher(page);
      if (!mounted.current) return;
      setItems(result.data);
      if (result.meta) {
        setTotal(result.meta.total as number ?? 0);
        setTotalPages(result.meta.totalPages as number ?? 1);
      }
    } catch (err) {
      if (!mounted.current) return;
      setError(err instanceof ApiError ? err.message : 'Failed to load data');
    } finally {
      if (mounted.current) setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, ...deps]);

  useEffect(() => {
    mounted.current = true;
    load();
    return () => { mounted.current = false; };
  }, [load]);

  return { items, total, page, totalPages, loading, error, setPage, refetch: load };
}
