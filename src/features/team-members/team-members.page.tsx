import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  NativeSelect,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Link, Outlet } from 'react-router-dom';
import {
  DataTable,
  DateRangeSelector,
  FiltersPanel,
  Loading,
  Pagination,
  TableChipFilter,
} from '~/common/ui';
import { useTeamMembersHandler } from './team-members.handler';

export default function TeamMembersPage() {
  const { t } = useTranslation('team-members');
  const statusChipOptions = [
    { value: '', label: t('filters.anyStatus') },
    { value: 'Active', label: t('status.active') },
    { value: 'Pending', label: t('status.pending') },
    { value: 'Inactive', label: t('status.inactive') },
  ];

  const {
    data,
    columns,
    sorting,
    setSorting,
    globalFilter,
    setGlobalFilter,
    statusFilter,
    setStatusFilter,
    roleFilter,
    setRoleFilter,
    createdRange,
    setCreatedRange,
    roleOptions,
    clearFilters,
    hasFilters,
    isLoading,
    pagination,
    rowSelection,
    setRowSelection,
  } = useTeamMembersHandler();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Box>
      <Stack gap={6}>
        <Flex justify="space-between" align="center">
          <Heading>{t('title')}</Heading>
          <Link to="create">
            <Button colorScheme="blue">{t('create.addButton')}</Button>
          </Link>
        </Flex>

        <Stack gap={3}>
          <Flex justify="space-between" align="center" gap={4} wrap="wrap">
            <Input
              maxW="400px"
              placeholder={t('searchPlaceholder')}
              value={globalFilter}
              onChange={e => setGlobalFilter(e.target.value)}
            />

            <FiltersPanel
              filters={{
                roleFilter,
                statusFilter,
                startDate: createdRange.startDate,
                endDate: createdRange.endDate,
              }}
            >
              {({ close }) => (
                <Stack gap={4} minW={{ base: '100%', md: '340px' }}>
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb={1}>
                      {t('filters.role')}
                    </Text>
                    <NativeSelect.Root>
                      <NativeSelect.Field
                        value={roleFilter}
                        onChange={e => setRoleFilter(e.target.value)}
                      >
                        <option value="">{t('filters.anyRole')}</option>
                        {roleOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                  </Box>

                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb={1}>
                      {t('filters.createdDate')}
                    </Text>
                    <DateRangeSelector
                      value={createdRange}
                      onChange={setCreatedRange}
                      testId="created-range-filter"
                    />
                  </Box>

                  <Flex gap={2} justify="flex-end">
                    {hasFilters && (
                      <Button variant="outline" onClick={clearFilters}>
                        {t('filters.clear')}
                      </Button>
                    )}
                    <Button onClick={close}>{t('filters.apply')}</Button>
                  </Flex>
                </Stack>
              )}
            </FiltersPanel>
          </Flex>

          <TableChipFilter
            value={statusFilter}
            options={statusChipOptions}
            onChange={setStatusFilter}
            justify="flex-start"
          />
        </Stack>

        <DataTable.Root
          data={data}
          columns={columns}
          sorting={sorting}
          onSortingChange={setSorting}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          enableRowSelection
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

      <Outlet />
    </Box>
  );
}
