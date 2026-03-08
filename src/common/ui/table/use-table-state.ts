import type { RowSelectionState, SortingState } from '@tanstack/react-table';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

type SortDirection = 'asc' | 'desc';

type TableStateOptions<
  TFilters extends Record<string, string | number | boolean>,
> = {
  filters: TFilters;
  defaultFiltersWhenMissing?: Partial<TFilters>;
  preserveEmptyFilterKeys?: (keyof TFilters)[];
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDirection?: SortDirection;
};

type TableState<TFilters extends Record<string, string | number | boolean>> = {
  filters: TFilters;
  page: number;
  limit: number;
  sortBy: string;
  sortDirection: SortDirection;
};

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_LIMIT = 10;

const parseNumber = (value: string | null, fallback: number): number => {
  if (value === null) return fallback;
  const parsed = Number(value);
  return isNaN(parsed) ? fallback : parsed;
};

const decodeQueryParamValue = (value: string): string => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const parseFilterValue = <T extends string | number | boolean>(
  urlValue: string | null,
  initialValue: T
): T => {
  if (urlValue === null) return initialValue;
  const decodedValue = decodeQueryParamValue(urlValue);
  if (typeof initialValue === 'number')
    return parseNumber(decodedValue, initialValue) as T;
  if (typeof initialValue === 'boolean') return (decodedValue === 'true') as T;
  return decodedValue as T;
};

export function useTableState<
  TFilters extends Record<string, string | number | boolean>,
>(initialState: TableStateOptions<TFilters>) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const isFirstRender = useRef(true);
  const prevFiltersRef = useRef<TFilters>(initialState.filters);

  const defaultPage = initialState.page ?? DEFAULT_PAGE;
  const defaultLimit = initialState.limit ?? DEFAULT_PAGE_LIMIT;
  const defaultFiltersWhenMissing =
    initialState.defaultFiltersWhenMissing ?? {};

  const parseStateFromUrl = (): TableState<TFilters> => {
    const filters = Object.fromEntries(
      Object.entries(initialState.filters).map(([key, initialValue]) => [
        key,
        parseFilterValue(
          searchParams.get(key),
          (searchParams.get(key) === null && key in defaultFiltersWhenMissing
            ? (
                defaultFiltersWhenMissing as Record<string, typeof initialValue>
              )[key]
            : initialValue) ?? initialValue
        ),
      ])
    ) as TFilters;

    const page = parseNumber(searchParams.get('page'), defaultPage);
    const limit = parseNumber(searchParams.get('limit'), defaultLimit);
    const sortBy = searchParams.get('sortBy') ?? initialState.sortBy ?? '';
    const sortDirection = (searchParams.get('sortDirection') ??
      initialState.sortDirection ??
      'asc') as SortDirection;

    return { filters, page, limit, sortBy, sortDirection };
  };

  const state = parseStateFromUrl();

  const setOrDeleteParam = (
    params: URLSearchParams,
    key: string,
    value: string | number | boolean | undefined | null,
    defaultValue?: string | number | boolean,
    preserveEmpty = false
  ) => {
    if (preserveEmpty && value === '') {
      params.set(key, '');
      return;
    }

    const isEmpty = value === '' || value === undefined || value === null;
    const isDefault = defaultValue !== undefined && value === defaultValue;
    if (isEmpty || isDefault) {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
  };

  const updateState = useCallback(
    (updates: Partial<TableState<TFilters>>) => {
      setSearchParams(
        prev => {
          const newParams = new URLSearchParams(prev);
          const preserveEmptyFilterKeys =
            initialState.preserveEmptyFilterKeys ?? [];
          const preserveEmptyFilterKeysSet = new Set(
            preserveEmptyFilterKeys.map(key => String(key))
          );

          if (updates.filters) {
            Object.entries(updates.filters).forEach(([key, value]) => {
              setOrDeleteParam(
                newParams,
                key,
                value,
                undefined,
                preserveEmptyFilterKeysSet.has(key)
              );
            });
          }

          if (updates.page !== undefined) {
            setOrDeleteParam(newParams, 'page', updates.page, 1);
          }

          if (updates.limit !== undefined) {
            setOrDeleteParam(newParams, 'limit', updates.limit, defaultLimit);
          }

          if (updates.sortBy !== undefined) {
            setOrDeleteParam(
              newParams,
              'sortBy',
              updates.sortBy,
              initialState.sortBy ?? ''
            );
          }

          if (updates.sortDirection !== undefined) {
            setOrDeleteParam(
              newParams,
              'sortDirection',
              updates.sortDirection,
              initialState.sortDirection ?? 'asc'
            );
          }

          return newParams;
        },
        { replace: true }
      );
    },
    [
      setSearchParams,
      defaultLimit,
      initialState.preserveEmptyFilterKeys,
      initialState.sortBy,
      initialState.sortDirection,
    ]
  );

  const resetRowSelection = useCallback(() => {
    setRowSelection({});
  }, []);

  const setFilters = useCallback(
    (filters: TFilters) => {
      updateState({ filters });
      resetRowSelection();
    },
    [updateState, resetRowSelection]
  );

  const setPage = useCallback(
    (page: number) => {
      updateState({ page });
      resetRowSelection();
    },
    [updateState, resetRowSelection]
  );

  const setLimit = useCallback(
    (limit: number) => {
      updateState({ limit });
      resetRowSelection();
    },
    [updateState, resetRowSelection]
  );

  const setSorting = (sorting: SortingState) => {
    if (sorting.length === 0) {
      updateState({ sortBy: '', sortDirection: 'asc' });
    } else {
      const sort = sorting[0];
      updateState({
        sortBy: sort.id,
        sortDirection: sort.desc ? 'desc' : 'asc',
      });
    }
  };

  useEffect(() => {
    if (isFirstRender.current) {
      prevFiltersRef.current = state.filters;
      isFirstRender.current = false;
      return;
    }

    const prevFilters = prevFiltersRef.current;
    const currentFilters = state.filters;

    const filtersChanged = Object.keys(currentFilters).some(
      key => prevFilters[key] !== currentFilters[key]
    );

    if (filtersChanged && state.page !== 1) {
      updateState({ page: 1 });
    }

    prevFiltersRef.current = currentFilters;
  }, [state.filters, state.page, updateState]);

  const sorting: SortingState = state.sortBy
    ? [{ id: state.sortBy, desc: state.sortDirection === 'desc' }]
    : [];

  return {
    filters: state.filters,
    page: state.page,
    limit: state.limit,
    sortBy: state.sortBy,
    sortDirection: state.sortDirection,
    sorting,
    setSorting,
    setFilters,
    setPage,
    setLimit,
    rowSelection,
    setRowSelection,
    selectedCount: Object.keys(rowSelection).length,
  };
}
