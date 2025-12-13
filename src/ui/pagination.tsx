import {
  ButtonGroup,
  Flex,
  IconButton,
  Pagination as ChakraPagination,
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
};

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: PaginationProps) {
  const { t } = useTranslation();

  return (
    <Flex justify="space-between" align="center" gap={4}>
      <Text fontSize="sm" color="gray.600">
        {t('pagination.page', { current: currentPage, total: totalPages })}
      </Text>

      <ChakraPagination.Root
        count={totalItems}
        pageSize={pageSize}
        page={currentPage}
        onPageChange={e => onPageChange(e.page)}
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
  );
}
