import { Box, Skeleton, Table } from '@chakra-ui/react';

type TableLoaderProps = {
  columns: number;
  rows?: number;
  showSelectionColumn?: boolean;
  selectionGutter?: number;
  testId?: string;
};

const CELL_WIDTHS = ['85%', '70%', '55%'] as const;

export function TableLoader({
  columns,
  rows = 8,
  showSelectionColumn = false,
  selectionGutter = 0,
  testId,
}: TableLoaderProps) {
  const safeColumns = Math.max(columns, 1);
  const safeRows = Math.max(rows, 1);

  return (
    <Box
      borderRadius="md"
      shadow="none"
      bg="white"
      overflowX="auto"
      borderWidth="1px"
      borderColor="gray.100"
      data-testid={testId}
    >
      <Table.Root variant="outline" size="sm" interactive={false}>
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
          <Table.Row bg="white" borderBottomWidth="1px" borderColor="gray.100">
            {showSelectionColumn && selectionGutter > 0 && (
              <Table.ColumnHeader w={`${selectionGutter}px`} px={0} py={3} />
            )}
            {showSelectionColumn && (
              <Table.ColumnHeader w="48px" px={4} py={3}>
                <Skeleton h="4" w="4" borderRadius="sm" />
              </Table.ColumnHeader>
            )}
            {Array.from({ length: safeColumns }).map((_, index) => (
              <Table.ColumnHeader
                key={`header-${index}`}
                py={3}
                pl={!showSelectionColumn && index === 0 ? 4 : undefined}
              >
                <Skeleton h="3" w={CELL_WIDTHS[index % CELL_WIDTHS.length]} />
              </Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {Array.from({ length: safeRows }).map((_, rowIndex) => (
            <Table.Row
              key={`row-${rowIndex}`}
              bg="white"
              borderBottomWidth="1px"
              borderColor="gray.100"
            >
              {showSelectionColumn && selectionGutter > 0 && (
                <Table.Cell w={`${selectionGutter}px`} px={0} py={3} />
              )}
              {showSelectionColumn && (
                <Table.Cell w="48px" px={4} py={3}>
                  <Skeleton h="4" w="4" borderRadius="sm" />
                </Table.Cell>
              )}
              {Array.from({ length: safeColumns }).map((_, colIndex) => (
                <Table.Cell
                  key={`cell-${rowIndex}-${colIndex}`}
                  py={3}
                  pl={!showSelectionColumn && colIndex === 0 ? 4 : undefined}
                >
                  <Skeleton
                    h="4"
                    w={CELL_WIDTHS[(rowIndex + colIndex) % CELL_WIDTHS.length]}
                  />
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}

export type { TableLoaderProps };
