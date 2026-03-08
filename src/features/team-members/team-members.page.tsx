import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Link, Outlet } from 'react-router-dom';
import {
  DATE_PRESETS,
  DataTable,
  DateRangeSelector,
  Loading,
  Pagination,
  getDateRangeFromPreset,
} from '~/common/ui';
import { useTeamMembersHandler } from './team-members.handler';

export default function TeamMembersPage() {
  const { t } = useTranslation('team-members');
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
    createdPreset,
    setCreatedPreset,
    createdRange,
    setCreatedRange,
    roleOptions,
    clearFilters,
    hasFilters,
    isLoading,
    pagination,
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
          <Input
            maxW="400px"
            placeholder={t('searchPlaceholder')}
            value={globalFilter}
            onChange={e => setGlobalFilter(e.target.value)}
          />

          <Flex gap={3} wrap="wrap" align="end">
            <Box minW="220px" maxW="260px">
              <Text fontSize="sm" fontWeight="medium" mb={1}>
                {t('filters.role')}
              </Text>
              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
                style={{
                  width: '100%',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  padding: '8px',
                  background: 'white',
                }}
              >
                <option value="">{t('filters.anyRole')}</option>
                {roleOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Box>

            <Box minW="220px" maxW="260px">
              <Text fontSize="sm" fontWeight="medium" mb={1}>
                {t('filters.status')}
              </Text>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                style={{
                  width: '100%',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  padding: '8px',
                  background: 'white',
                }}
              >
                <option value="">{t('filters.anyStatus')}</option>
                <option value="Active">{t('status.active')}</option>
                <option value="Pending">{t('status.pending')}</option>
                <option value="Inactive">{t('status.inactive')}</option>
              </select>
            </Box>

            <Box minW="220px" maxW="260px">
              <Text fontSize="sm" fontWeight="medium" mb={1}>
                {t('filters.createdPreset')}
              </Text>
              <select
                value={createdPreset}
                onChange={e => {
                  const value = e.target.value;
                  setCreatedPreset(value);
                  const range = getDateRangeFromPreset(value);
                  setCreatedRange({
                    startDate: range.firstSeen,
                    endDate: range.lastSeen,
                  });
                }}
                style={{
                  width: '100%',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  padding: '8px',
                  background: 'white',
                }}
              >
                <option value="">{t('filters.anyDate')}</option>
                <option value={DATE_PRESETS.allTime}>
                  {t('common:filters.datePresets.allTime')}
                </option>
                <option value={DATE_PRESETS.lastWeek}>
                  {t('common:filters.datePresets.lastWeek')}
                </option>
                <option value={DATE_PRESETS.last30Days}>
                  {t('common:filters.datePresets.last30Days')}
                </option>
                <option value={DATE_PRESETS.last3Months}>
                  {t('common:filters.datePresets.last3Months')}
                </option>
                <option value={DATE_PRESETS.last6Months}>
                  {t('common:filters.datePresets.last6Months')}
                </option>
                <option value={DATE_PRESETS.last12Months}>
                  {t('common:filters.datePresets.last12Months')}
                </option>
              </select>
            </Box>

            <Box minW="280px" maxW="360px">
              <DateRangeSelector
                value={createdRange}
                onChange={setCreatedRange}
                testId="created-range-filter"
              />
            </Box>

            {hasFilters && (
              <Button variant="outline" onClick={clearFilters}>
                {t('filters.clear')}
              </Button>
            )}
          </Flex>
        </Stack>

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

      <Outlet />
    </Box>
  );
}
