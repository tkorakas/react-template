import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getTeamMembers } from '~/data-access/api';
import type { ColumnDef, SortingState } from '~/ui';

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

  return {
    data: data?.data ?? [],
    columns,
    sorting,
    setSorting,
    globalFilter,
    setGlobalFilter,
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
