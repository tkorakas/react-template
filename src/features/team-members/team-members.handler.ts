import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { hasActiveFilters, useTableState } from '~/common/ui';
import { getTeamMembers } from '~/data-access/team-members/team-members.api';
import { useTeamMembersColumns } from './team-members.column';

const TEAM_MEMBERS_DEFAULT_FILTERS = {
  search: '',
  status: '',
  role: '',
  startDate: '',
  endDate: '',
};

export function useTeamMembersHandler() {
  const {
    filters,
    page,
    limit,
    sorting,
    setSorting,
    setPage,
    setFilters,
    rowSelection,
    setRowSelection,
  } = useTableState({
    filters: TEAM_MEMBERS_DEFAULT_FILTERS,
    limit: 5,
    preserveEmptyFilterKeys: ['search'],
  });
  const columns = useTeamMembersColumns();

  const setSearchFilter = (search: string) => {
    setFilters({ ...filters, search });
  };

  const setStatusFilter = (status: string) => {
    setFilters({ ...filters, status });
  };

  const setRoleFilter = (role: string) => {
    setFilters({ ...filters, role });
  };

  const setCreatedRange = (value: { startDate?: string; endDate?: string }) => {
    setFilters({
      ...filters,
      startDate: value.startDate ?? '',
      endDate: value.endDate ?? '',
    });
  };

  const clearFilters = () => {
    setFilters(TEAM_MEMBERS_DEFAULT_FILTERS);
  };

  const hasFilters = hasActiveFilters({
    status: filters.status,
    role: filters.role,
    startDate: filters.startDate,
    endDate: filters.endDate,
  });

  const createdRange = {
    startDate: filters.startDate || undefined,
    endDate: filters.endDate || undefined,
  };

  const globalFilter = filters.search;

  const statusFilter = filters.status;

  const roleFilter = filters.role;

  const { data, isLoading } = useQuery({
    queryKey: ['team-members', page, limit],
    queryFn: () => getTeamMembers(page, limit),
  });

  const filteredData = useMemo(() => {
    const term = filters.search.trim().toLowerCase();
    const startDate = filters.startDate;
    const endDate = filters.endDate;

    return (data?.data ?? []).filter(member => {
      const matchesSearch =
        !term ||
        member.name.toLowerCase().includes(term) ||
        member.role.toLowerCase().includes(term);

      const matchesStatus = !filters.status || member.status === filters.status;

      const matchesRole =
        !filters.role ||
        member.role.toLowerCase() === filters.role.toLowerCase();

      const createdDay = member.createdAt.slice(0, 10);
      const matchesDate =
        (!startDate || createdDay >= startDate) &&
        (!endDate || createdDay <= endDate);

      return matchesSearch && matchesStatus && matchesRole && matchesDate;
    });
  }, [data?.data, filters]);

  const roleOptions = useMemo(() => {
    const roles = Array.from(
      new Set((data?.data ?? []).map(item => item.role))
    );
    return roles.map(role => ({ label: role, value: role }));
  }, [data?.data]);

  return {
    data: filteredData,
    columns,
    rowSelection,
    setRowSelection,
    sorting,
    setSorting,
    globalFilter,
    setGlobalFilter: setSearchFilter,
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
    pagination: {
      currentPage: data?.page ?? 1,
      totalPages: data?.totalPages ?? 1,
      totalItems: data?.total ?? 0,
      pageSize: data?.limit ?? limit,
      onPageChange: setPage,
    },
  };
}
