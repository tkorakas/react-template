import { Button, Flex, HStack, Text } from '@chakra-ui/react';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
};

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}: PaginationProps) {
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <Flex justify="space-between" align="center" gap={4}>
      <Text fontSize="sm" color="gray.600">
        Page {currentPage} of {totalPages}
      </Text>

      <HStack gap={2}>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrevious || isLoading}
        >
          Previous
        </Button>

        {getPageNumbers().map((page, index) =>
          page === '...' ? (
            <Text key={`ellipsis-${index}`} px={2} color="gray.400">
              ...
            </Text>
          ) : (
            <Button
              key={page}
              size="sm"
              variant={page === currentPage ? 'solid' : 'outline'}
              colorScheme={page === currentPage ? 'blue' : 'gray'}
              onClick={() => onPageChange(page as number)}
              disabled={isLoading}
            >
              {page}
            </Button>
          )
        )}

        <Button
          size="sm"
          variant="outline"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext || isLoading}
        >
          Next
        </Button>
      </HStack>
    </Flex>
  );
}
