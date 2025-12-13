import { Box, Heading, Input, Stack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { DataTable, Loading, Pagination } from '~/ui';
import { useTeamMembersHandler } from './use-handler';

export default function TeamMembersPage() {
  const { t } = useTranslation('team-members');
  const {
    data,
    columns,
    sorting,
    setSorting,
    globalFilter,
    setGlobalFilter,
    isLoading,
    pagination,
  } = useTeamMembersHandler();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Box>
      <Stack gap={6}>
        <Heading>{t('title')}</Heading>

        <Input
          maxW="400px"
          placeholder={t('searchPlaceholder')}
          value={globalFilter}
          onChange={e => setGlobalFilter(e.target.value)}
        />

        <DataTable.Root
          data={data}
          columns={columns}
          sorting={sorting}
          onSortingChange={setSorting}
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
        >
          <DataTable.Header />
          <DataTable.Body />
        </DataTable.Root>

        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          pageSize={pagination.pageSize}
          onPageChange={pagination.onPageChange}
          isLoading={isLoading}
        />
      </Stack>
    </Box>
  );
}
