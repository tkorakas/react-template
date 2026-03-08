import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getTeamMembers } from '~/data-access/api';
import type { ColumnDef, SortingState } from '~/common/ui';

type TeamMember = {
  id: number;
  name: string;
  role: string;
  status: 'Active' | 'Pending' | 'Inactive';
};

export function useTeamMembersHandler() {
  const { t } = useTranslation('team-members');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [createdPreset, setCreatedPreset] = useState('');
  const [createdRange, setCreatedRange] = useState<{
    startDate?: string;
    endDate?: string;
  }>({});
  const [page, setPage] = useState(1);
  const limit = 5;

  const columns: ColumnDef<TeamMember>[] = useMemo(
    () => [
      { accessorKey: 'name', header: t('columns.name') },
      { accessorKey: 'role', header: t('columns.role') },
      { accessorKey: 'status', header: t('columns.status') },
    ],
    [t]
  );

  const { data, isLoading } = useQuery({
    queryKey: ['team-members', page],
    queryFn: () => getTeamMembers(page, limit),
  });

  const filteredData = useMemo(() => {
    const term = globalFilter.trim().toLowerCase();
    const startDate = createdRange.startDate;
    const endDate = createdRange.endDate;

    return (data?.data ?? []).filter(member => {
      const matchesSearch =
        !term ||
        member.name.toLowerCase().includes(term) ||
        member.role.toLowerCase().includes(term);

      const matchesStatus = !statusFilter || member.status === statusFilter;

      const matchesRole =
        !roleFilter || member.role.toLowerCase() === roleFilter.toLowerCase();

      const createdDay = member.createdAt.slice(0, 10);
      const matchesDate =
        (!startDate || createdDay >= startDate) &&
        (!endDate || createdDay <= endDate);

      return matchesSearch && matchesStatus && matchesRole && matchesDate;
    });
  }, [data?.data, globalFilter, statusFilter, roleFilter, createdRange]);

  const roleOptions = useMemo(() => {
    const roles = Array.from(
      new Set((data?.data ?? []).map(item => item.role))
    );
    return roles.map(role => ({ label: role, value: role }));
  }, [data?.data]);

  const clearFilters = () => {
    setStatusFilter('');
    setRoleFilter('');
    setCreatedPreset('');
    setCreatedRange({});
    setGlobalFilter('');
  };

  const hasFilters =
    !!statusFilter ||
    !!roleFilter ||
    !!createdPreset ||
    !!createdRange.startDate ||
    !!createdRange.endDate;

  return {
    data: filteredData,
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
    pagination: {
      currentPage: data?.page ?? 1,
      totalPages: data?.totalPages ?? 1,
      totalItems: data?.total ?? 0,
      pageSize: limit,
      onPageChange: setPage,
    },
  };
}
