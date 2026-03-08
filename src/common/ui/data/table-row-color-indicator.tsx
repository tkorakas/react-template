import { Box } from '@chakra-ui/react';

type TableRowColorIndicatorProps = {
  color: string;
};

export function TableRowColorIndicator({ color }: TableRowColorIndicatorProps) {
  return <Box w="full" h="full" minH="40px" bg={color} />;
}

export type { TableRowColorIndicatorProps };
