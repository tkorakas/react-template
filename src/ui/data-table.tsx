import { Flex, Table, Text } from '@chakra-ui/react';
import {
  type Cell,
  type ColumnDef,
  type Header,
  type Row,
  type RowData,
  type SortingState,
  type Table as TanstackTable,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
  type ComponentProps,
} from 'react';

type DataTableContextValue<TData extends RowData> = {
  table: TanstackTable<TData>;
  ascIcon: ReactNode;
  descIcon: ReactNode;
};

const DataTableContext = createContext<DataTableContextValue<unknown> | null>(
  null
);

function useDataTableContext<TData extends RowData>() {
  const context = useContext(DataTableContext);
  if (!context) {
    throw new Error('DataTable components must be used within DataTable.Root');
  }
  return context as DataTableContextValue<TData>;
}

type DataTableRootProps<TData extends RowData> = {
  data: TData[];
  columns: ColumnDef<TData>[];
  sorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;
  globalFilter?: string;
  onGlobalFilterChange?: (filter: string) => void;
  ascIcon?: ReactNode;
  descIcon?: ReactNode;
  children: ReactNode;
} & Omit<ComponentProps<typeof Table.Root>, 'children'>;

function DataTableRoot<TData extends RowData>({
  data,
  columns,
  sorting: externalSorting,
  onSortingChange,
  globalFilter,
  onGlobalFilterChange,
  ascIcon = '▲',
  descIcon = '▼',
  children,
  ...tableProps
}: DataTableRootProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting: externalSorting,
      globalFilter,
    },
    onSortingChange: updater => {
      if (onSortingChange) {
        const newSorting =
          typeof updater === 'function'
            ? updater(externalSorting ?? [])
            : updater;
        onSortingChange(newSorting);
      }
    },
    onGlobalFilterChange: updater => {
      if (onGlobalFilterChange) {
        const newFilter =
          typeof updater === 'function' ? updater(globalFilter ?? '') : updater;
        onGlobalFilterChange(newFilter);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: 'includesString',
  });

  const contextValue = useMemo(
    () => ({ table, ascIcon, descIcon }),
    [table, ascIcon, descIcon]
  ) as DataTableContextValue<unknown>;

  return (
    <DataTableContext.Provider value={contextValue}>
      <Table.Root variant="outline" size="md" {...tableProps}>
        {children}
      </Table.Root>
    </DataTableContext.Provider>
  );
}

type DataTableHeaderProps<TData extends RowData> = {
  children?: (
    header: Header<TData, unknown>,
    defaultContent: ReactNode
  ) => ReactNode;
};

function DataTableHeader<TData extends RowData>({
  children,
}: DataTableHeaderProps<TData>) {
  const { table, ascIcon, descIcon } = useDataTableContext<TData>();

  const renderDefaultCell = (header: Header<TData, unknown>) => (
    <Flex align="center" gap={2}>
      {flexRender(header.column.columnDef.header, header.getContext())}
      <Text as="span" color="gray.500" fontSize="sm">
        {header.column.getIsSorted() === 'asc'
          ? ascIcon
          : header.column.getIsSorted() === 'desc'
            ? descIcon
            : null}
      </Text>
    </Flex>
  );

  return (
    <Table.Header>
      {table.getHeaderGroups().map(headerGroup => (
        <Table.Row key={headerGroup.id}>
          {headerGroup.headers.map(header => (
            <Table.ColumnHeader
              key={header.id}
              cursor={header.column.getCanSort() ? 'pointer' : 'default'}
              onClick={header.column.getToggleSortingHandler()}
              userSelect="none"
            >
              {children
                ? children(header, renderDefaultCell(header))
                : renderDefaultCell(header)}
            </Table.ColumnHeader>
          ))}
        </Table.Row>
      ))}
    </Table.Header>
  );
}

type DataTableBodyProps<TData extends RowData> = {
  emptyState?: ReactNode;
  children?: (
    cell: Cell<TData, unknown>,
    defaultContent: ReactNode
  ) => ReactNode;
};

function DataTableBody<TData extends RowData>({
  emptyState = 'No results',
  children,
}: DataTableBodyProps<TData>) {
  const { table } = useDataTableContext<TData>();
  const rows = table.getRowModel().rows;
  const columnCount = table.getAllColumns().length;

  const renderDefaultCell = (cell: Cell<TData, unknown>) =>
    flexRender(cell.column.columnDef.cell, cell.getContext());

  return (
    <Table.Body>
      {rows.map(row => (
        <Table.Row key={row.id}>
          {row.getVisibleCells().map(cell => (
            <Table.Cell key={cell.id}>
              {children
                ? children(cell, renderDefaultCell(cell))
                : renderDefaultCell(cell)}
            </Table.Cell>
          ))}
        </Table.Row>
      ))}
      {rows.length === 0 && (
        <Table.Row>
          <Table.Cell colSpan={columnCount} textAlign="center" py={8}>
            {emptyState}
          </Table.Cell>
        </Table.Row>
      )}
    </Table.Body>
  );
}

export const DataTable = {
  Root: DataTableRoot,
  Header: DataTableHeader,
  Body: DataTableBody,
};

export type { Cell, ColumnDef, Header, Row, SortingState };
