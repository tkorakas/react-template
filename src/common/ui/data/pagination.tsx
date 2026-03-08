import {
  Box,
  ButtonGroup,
  Pagination as ChakraPagination,
  Flex,
  IconButton,
  Text,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  testId?: string;
};

type PageChangeDetails = {
  page: number;
};

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  testId,
}: PaginationProps) {
  const { t } = useTranslation();

  return (
    <Box borderRadius="md" p={{ base: 2, md: 4 }} data-testid={testId}>
      <Flex
        justify="space-between"
        align="center"
        gap={{ base: 2, md: 4 }}
        direction={{ base: 'column', md: 'row' }}
      >
        <Text fontSize="sm" color="gray.600">
          {t('pagination.page', { current: currentPage, total: totalPages })}
        </Text>

        <ChakraPagination.Root
          count={totalItems}
          pageSize={pageSize}
          page={currentPage}
          onPageChange={(details: PageChangeDetails) => onPageChange(details.page)}
          siblingCount={1}
        >
          <ButtonGroup variant="ghost" size="sm">
            <ChakraPagination.PrevTrigger asChild>
              <IconButton aria-label="Previous page">
                <LuChevronLeft />
              </IconButton>
            </ChakraPagination.PrevTrigger>

            <ChakraPagination.Items
              render={page => (
                <IconButton
                  aria-label={`Page ${page.value}`}
                  variant={{ base: 'ghost', _selected: 'outline' }}
                >
                  {page.value}
                </IconButton>
              )}
            />

            <ChakraPagination.NextTrigger asChild>
              <IconButton aria-label="Next page">
                <LuChevronRight />
              </IconButton>
            </ChakraPagination.NextTrigger>
          </ButtonGroup>
        </ChakraPagination.Root>
      </Flex>
    </Box>
  );
}
