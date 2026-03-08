import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { useTableState } from './use-table-state';

type Filters = {
  search: string;
  status: string;
  minPrice: number;
};

function createWrapper(initialUrl = '/') {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <MemoryRouter initialEntries={[initialUrl]}>
        <Routes>
          <Route path="*" element={<>{children}</>} />
        </Routes>
      </MemoryRouter>
    );
  };
}

describe('useTableState', () => {
  it('initializes with default values', () => {
    const { result } = renderHook(
      () =>
        useTableState<Filters>({
          filters: { search: '', status: 'active', minPrice: 0 },
          page: 1,
          limit: 10,
        }),
      { wrapper: createWrapper() }
    );

    expect(result.current.filters).toEqual({
      search: '',
      status: 'active',
      minPrice: 0,
    });
    expect(result.current.page).toBe(1);
    expect(result.current.limit).toBe(10);
    expect(result.current.sorting).toEqual([]);
    expect(result.current.rowSelection).toEqual({});
    expect(result.current.selectedCount).toBe(0);
  });

  it('parses state from URL query params', async () => {
    const { result } = renderHook(
      () =>
        useTableState<Filters>({
          filters: { search: '', status: 'active', minPrice: 0 },
        }),
      {
        wrapper: createWrapper(
          '/?search=test&status=inactive&minPrice=100&page=3&limit=20'
        ),
      }
    );

    await waitFor(() => {
      expect(result.current.filters).toEqual({
        search: 'test',
        status: 'inactive',
        minPrice: 100,
      });
      expect(result.current.page).toBe(3);
      expect(result.current.limit).toBe(20);
    });
  });

  it('updates sorting and converts to URL params', async () => {
    const { result } = renderHook(
      () =>
        useTableState<Filters>({
          filters: { search: '', status: '', minPrice: 0 },
        }),
      { wrapper: createWrapper() }
    );

    act(() => {
      result.current.setSorting([{ id: 'name', desc: true }]);
    });

    await waitFor(() => {
      expect(result.current.sorting).toEqual([{ id: 'name', desc: true }]);
    });
  });

  it('resets page to 1 when filters change', async () => {
    const { result } = renderHook(
      () =>
        useTableState<Filters>({
          filters: { search: '', status: '', minPrice: 0 },
        }),
      { wrapper: createWrapper('/?page=5') }
    );

    expect(result.current.page).toBe(5);

    act(() => {
      result.current.setFilters({
        search: 'new search',
        status: '',
        minPrice: 0,
      });
    });

    await waitFor(() => {
      expect(result.current.page).toBe(1);
    });
  });

  it('manages row selection independently from URL', async () => {
    const { result } = renderHook(
      () =>
        useTableState<Filters>({
          filters: { search: '', status: '', minPrice: 0 },
        }),
      { wrapper: createWrapper() }
    );

    act(() => {
      result.current.setRowSelection({ '1': true, '3': true });
    });

    await waitFor(() => {
      expect(result.current.rowSelection).toEqual({ '1': true, '3': true });
      expect(result.current.selectedCount).toBe(2);
    });
  });
});
