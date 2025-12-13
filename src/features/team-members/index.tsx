import { Box, Heading, Input, Stack } from '@chakra-ui/react';
import { DataTable, Loading, Pagination } from '~/ui';
import { useTeamMembersHandler } from './use-handler';

export default function TeamMembersPage() {
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
    <Box p={8}>
      <Stack gap={6}>
        <Heading>Team Members</Heading>

        <Input
          maxW="400px"
          placeholder="Search team members..."
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
          onPageChange={pagination.onPageChange}
          isLoading={isLoading}
        />
      </Stack>
    </Box>
  );
}
