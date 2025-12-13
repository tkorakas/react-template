import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { system } from '~/common/system';
import { DataTable, type ColumnDef, type SortingState } from './data-table';

type Person = {
  id: string;
  name: string;
  role: string;
};

const mockData: Person[] = [
  { id: '1', name: 'Alice', role: 'Engineer' },
  { id: '2', name: 'Bob', role: 'Designer' },
  { id: '3', name: 'Charlie', role: 'Manager' },
];

const columns: ColumnDef<Person>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'role', header: 'Role' },
];

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <ChakraProvider value={system}>{children}</ChakraProvider>
      </QueryClientProvider>
    );
  };
}

function DataTableWithSorting({
  data,
  columns: cols,
  onSortingChange,
}: {
  data: Person[];
  columns: ColumnDef<Person>[];
  onSortingChange?: (sorting: SortingState) => void;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const handleSortingChange = (newSorting: SortingState) => {
    setSorting(newSorting);
    onSortingChange?.(newSorting);
  };

  return (
    <DataTable.Root
      data={data}
      columns={cols}
      sorting={sorting}
      onSortingChange={handleSortingChange}
    >
      <DataTable.Header />
      <DataTable.Body />
    </DataTable.Root>
  );
}

describe('DataTable', () => {
  it('renders table with data', () => {
    render(
      <DataTable.Root data={mockData} columns={columns}>
        <DataTable.Header />
        <DataTable.Body />
      </DataTable.Root>,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
    expect(screen.getByText('Engineer')).toBeInTheDocument();
  });

  it('renders empty state when no data', () => {
    render(
      <DataTable.Root data={[]} columns={columns}>
        <DataTable.Header />
        <DataTable.Body />
      </DataTable.Root>,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText('No results')).toBeInTheDocument();
  });

  it('renders custom empty state', () => {
    render(
      <DataTable.Root data={[]} columns={columns}>
        <DataTable.Header />
        <DataTable.Body emptyState="Nothing to show" />
      </DataTable.Root>,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText('Nothing to show')).toBeInTheDocument();
  });

  it('calls onSortingChange when clicking header', async () => {
    const user = userEvent.setup();
    const onSortingChange = vi.fn();

    render(
      <DataTableWithSorting
        data={mockData}
        columns={columns}
        onSortingChange={onSortingChange}
      />,
      { wrapper: createWrapper() }
    );

    const nameHeader = screen.getByText('Name');
    await user.click(nameHeader);

    expect(onSortingChange).toHaveBeenCalledWith([{ id: 'name', desc: false }]);
  });

  it('toggles sorting direction on multiple clicks', async () => {
    const user = userEvent.setup();
    const onSortingChange = vi.fn();

    render(
      <DataTableWithSorting
        data={mockData}
        columns={columns}
        onSortingChange={onSortingChange}
      />,
      { wrapper: createWrapper() }
    );

    const nameHeader = screen.getByText('Name');

    await user.click(nameHeader);
    expect(onSortingChange).toHaveBeenLastCalledWith([
      { id: 'name', desc: false },
    ]);

    await user.click(nameHeader);
    expect(onSortingChange).toHaveBeenLastCalledWith([
      { id: 'name', desc: true },
    ]);
  });

  it('displays sort indicators', async () => {
    const user = userEvent.setup();

    render(<DataTableWithSorting data={mockData} columns={columns} />, {
      wrapper: createWrapper(),
    });

    const nameHeader = screen.getByText('Name').closest('th');
    expect(nameHeader).not.toHaveTextContent('▲');

    await user.click(screen.getByText('Name'));
    expect(within(nameHeader!).getByText('▲')).toBeInTheDocument();

    await user.click(screen.getByText('Name'));
    expect(within(nameHeader!).getByText('▼')).toBeInTheDocument();
  });

  it('supports custom sort icons', async () => {
    const user = userEvent.setup();

    function TableWithCustomIcons() {
      const [sorting, setSorting] = useState<SortingState>([]);
      return (
        <DataTable.Root
          data={mockData}
          columns={columns}
          sorting={sorting}
          onSortingChange={setSorting}
          ascIcon="↑"
          descIcon="↓"
        >
          <DataTable.Header />
          <DataTable.Body />
        </DataTable.Root>
      );
    }

    render(<TableWithCustomIcons />, { wrapper: createWrapper() });

    await user.click(screen.getByText('Name'));
    expect(screen.getByText('↑')).toBeInTheDocument();

    await user.click(screen.getByText('Name'));
    expect(screen.getByText('↓')).toBeInTheDocument();
  });

  it('supports custom cell rendering via children', () => {
    render(
      <DataTable.Root data={mockData} columns={columns}>
        <DataTable.Header />
        <DataTable.Body>
          {(cell, defaultContent) =>
            cell.column.id === 'role' ? (
              <span data-testid="custom-role">{defaultContent}</span>
            ) : (
              defaultContent
            )
          }
        </DataTable.Body>
      </DataTable.Root>,
      { wrapper: createWrapper() }
    );

    const customRoles = screen.getAllByTestId('custom-role');
    expect(customRoles).toHaveLength(3);
    expect(customRoles[0]).toHaveTextContent('Engineer');
  });

  it('supports custom header rendering via children', () => {
    render(
      <DataTable.Root data={mockData} columns={columns}>
        <DataTable.Header>
          {(header, defaultContent) =>
            header.column.id === 'name' ? (
              <span data-testid="custom-header">{defaultContent}</span>
            ) : (
              defaultContent
            )
          }
        </DataTable.Header>
        <DataTable.Body />
      </DataTable.Root>,
      { wrapper: createWrapper() }
    );

    const customHeader = screen.getByTestId('custom-header');
    expect(customHeader).toBeInTheDocument();
    expect(customHeader).toHaveTextContent('Name');
  });

  it('filters data with globalFilter', () => {
    render(
      <DataTable.Root data={mockData} columns={columns} globalFilter="Bob">
        <DataTable.Header />
        <DataTable.Body />
      </DataTable.Root>,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.queryByText('Alice')).not.toBeInTheDocument();
    expect(screen.queryByText('Charlie')).not.toBeInTheDocument();
  });

  it('throws error when components used outside DataTable.Root', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() =>
      render(<DataTable.Header />, { wrapper: createWrapper() })
    ).toThrow('DataTable components must be used within DataTable.Root');

    consoleSpy.mockRestore();
  });
});
