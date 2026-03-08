import { Box, Checkbox, Flex, Table, Text } from '@chakra-ui/react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  type Cell,
  type ColumnDef,
  type Header,
  type Row,
  type RowData,
  type RowSelectionState,
  type SortingState,
  type Table as TanstackTable,
} from '@tanstack/react-table';
import {
  createContext,
  useContext,
  useMemo,
  type ComponentProps,
  type ReactNode,
} from 'react';
import { FaSort } from 'react-icons/fa';

type DataTableContextValue<TData extends RowData> = {
  table: TanstackTable<TData>;
  enableRowSelection: boolean;
  selectionGutter: number;
  ascIcon: ReactNode;
  descIcon: ReactNode;
  leadingCell?: {
    width: number;
    color?: (row: Row<TData>) => string;
    renderCell?: (row: Row<TData>) => ReactNode;
  };
  getRowProps?: (row: Row<TData>) => ComponentProps<typeof Table.Row>;
};

type CheckedChangeDetails = {
  checked: boolean | 'indeterminate';
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
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: (selection: RowSelectionState) => void;
  enableRowSelection?: boolean;
  selectionGutter?: number;
  ascIcon?: ReactNode;
  descIcon?: ReactNode;
  leadingCell?: {
    width?: number;
    color?: (row: Row<TData>) => string;
    renderCell?: (row: Row<TData>) => ReactNode;
  };
  striped?: boolean;
  interactive?: boolean;
  getRowProps?: (row: Row<TData>) => ComponentProps<typeof Table.Row>;
  children: ReactNode;
} & Omit<
  ComponentProps<typeof Table.Root>,
  'children' | 'variant' | 'interactive' | 'striped'
>;

function DataTableRoot<TData extends RowData>({
  data,
  columns,
  sorting: externalSorting,
  onSortingChange,
  globalFilter,
  onGlobalFilterChange,
  rowSelection: externalRowSelection,
  onRowSelectionChange,
  enableRowSelection = false,
  selectionGutter = 0,
  ascIcon = '▲',
  descIcon = '▼',
  leadingCell,
  interactive = true,
  getRowProps,
  children,
  ...tableProps
}: DataTableRootProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting: externalSorting,
      globalFilter,
      rowSelection: externalRowSelection ?? {},
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
    onRowSelectionChange: updater => {
      if (onRowSelectionChange) {
        const newSelection =
          typeof updater === 'function'
            ? updater(externalRowSelection ?? {})
            : updater;
        onRowSelectionChange(newSelection);
      }
    },
    onGlobalFilterChange: updater => {
      if (onGlobalFilterChange) {
        const newFilter =
          typeof updater === 'function' ? updater(globalFilter ?? '') : updater;
        onGlobalFilterChange(newFilter);
      }
    },
    enableRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: 'includesString',
    manualSorting: true,
  });

  const contextValue = useMemo(
    () => ({
      table,
      enableRowSelection,
      selectionGutter,
      ascIcon,
      descIcon,
      leadingCell: leadingCell
        ? {
            width: leadingCell.width ?? 12,
            color: leadingCell.color,
            renderCell: leadingCell.renderCell,
          }
        : undefined,
      getRowProps,
    }),
    [
      table,
      enableRowSelection,
      selectionGutter,
      ascIcon,
      descIcon,
      leadingCell,
      getRowProps,
    ]
  ) as DataTableContextValue<unknown>;

  return (
    <DataTableContext.Provider value={contextValue}>
      <Box
        borderRadius="md"
        shadow="none"
        bg="white"
        overflowX="auto"
        borderWidth="1px"
        borderColor="gray.100"
      >
        <Table.Root
          variant="outline"
          size="sm"
          interactive={interactive}
          borderColor="gray.100"
          {...tableProps}
        >
          {children}
        </Table.Root>
      </Box>
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
  const { table, enableRowSelection, selectionGutter, ascIcon, descIcon, leadingCell } =
    useDataTableContext<TData>();

  const renderDefaultCell = (header: Header<TData, unknown>) => (
    <Flex align="center" gap={2}>
      {flexRender(header.column.columnDef.header, header.getContext())}
      {header.column.getCanSort() && (
        <Text as="span" color="gray.500" fontSize="sm">
          {header.column.getIsSorted() === 'asc'
            ? ascIcon
            : header.column.getIsSorted() === 'desc'
              ? descIcon
              : <FaSort />}
        </Text>
      )}
    </Flex>
  );

  return (
    <Table.Header
      bg="white"
      position="relative"
      _after={{
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '1px',
        bg: 'gray.100',
      }}
    >
      {table.getHeaderGroups().map(headerGroup => (
        <Table.Row
          key={headerGroup.id}
          bg="white"
          borderBottomWidth="1px"
          borderColor="gray.100"
        >
          {leadingCell && (
            <Table.ColumnHeader
              w={`${leadingCell.width}px`}
              minW={`${leadingCell.width}px`}
              maxW={`${leadingCell.width}px`}
              px={0}
              py={3}
            />
          )}
          {enableRowSelection && selectionGutter > 0 && (
            <Table.ColumnHeader w={`${selectionGutter}px`} px={0} py={3} />
          )}
          {enableRowSelection && (
            <Table.ColumnHeader w="48px" px={4} py={3}>
              <Checkbox.Root
                checked={
                  table.getIsAllRowsSelected()
                    ? true
                    : table.getIsSomeRowsSelected()
                      ? 'indeterminate'
                      : false
                }
                onCheckedChange={(details: CheckedChangeDetails) =>
                  table.toggleAllRowsSelected(details.checked === true)
                }
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
              </Checkbox.Root>
            </Table.ColumnHeader>
          )}
          {headerGroup.headers.map((header, index) => (
            <Table.ColumnHeader
              key={header.id}
              cursor={header.column.getCanSort() ? 'pointer' : 'default'}
              onClick={header.column.getToggleSortingHandler()}
              userSelect="none"
              whiteSpace="nowrap"
              pl={!enableRowSelection && index === 0 ? 4 : undefined}
              py={3}
              color="gray.600"
              fontSize="xs"
              fontWeight="semibold"
              textTransform="uppercase"
              letterSpacing="wider"
              w={
                header.column.columnDef.size
                  ? `${header.column.columnDef.size}px`
                  : undefined
              }
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
  const {
    table,
    enableRowSelection,
    selectionGutter,
    leadingCell,
    getRowProps,
  } = useDataTableContext<TData>();
  const rows = table.getRowModel().rows;
  const columnCount =
    table.getAllColumns().length +
    (leadingCell ? 1 : 0) +
    (enableRowSelection ? 1 : 0) +
    (enableRowSelection && selectionGutter > 0 ? 1 : 0);

  const renderDefaultCell = (cell: Cell<TData, unknown>) =>
    flexRender(cell.column.columnDef.cell, cell.getContext());

  return (
    <Table.Body>
      {rows.map(row => (
        <Table.Row
          key={row.id}
          bg="white"
          borderBottomWidth="1px"
          borderColor="gray.100"
          role="group"
          _hover={{
            bg: 'gray.50',
          }}
          {...(getRowProps ? getRowProps(row) : {})}
        >
          {leadingCell && (
            <Table.Cell
              w={`${leadingCell.width}px`}
              minW={`${leadingCell.width}px`}
              maxW={`${leadingCell.width}px`}
              px={0}
              py={0}
              bg={leadingCell.color ? leadingCell.color(row) : undefined}
            >
              {leadingCell.renderCell ? leadingCell.renderCell(row) : null}
            </Table.Cell>
          )}
          {enableRowSelection && selectionGutter > 0 && (
            <Table.Cell w={`${selectionGutter}px`} px={0} py={3} />
          )}
          {enableRowSelection && (
            <Table.Cell w="48px" px={4} py={3}>
              <Checkbox.Root
                checked={row.getIsSelected()}
                disabled={!row.getCanSelect()}
                onCheckedChange={(details: CheckedChangeDetails) =>
                  row.toggleSelected(details.checked === true)
                }
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
              </Checkbox.Root>
            </Table.Cell>
          )}
          {row.getVisibleCells().map((cell, index) => (
            <Table.Cell
              key={cell.id}
              whiteSpace="nowrap"
              pl={!enableRowSelection && index === 0 ? 4 : undefined}
              py={3}
              w={
                cell.column.columnDef.size
                  ? `${cell.column.columnDef.size}px`
                  : undefined
              }
            >
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

export type { Cell, ColumnDef, Header, Row, RowSelectionState, SortingState };
