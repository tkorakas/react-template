import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { getTeamMembers } from '~/data-access/api';
import type { ColumnDef, SortingState } from '~/ui';

type TeamMember = {
  id: number;
  name: string;
  role: string;
  status: 'Active' | 'Pending' | 'Inactive';
};

const columns: ColumnDef<TeamMember>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'role', header: 'Role' },
  { accessorKey: 'status', header: 'Status' },
];

export function useTeamMembersHandler() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [page, setPage] = useState(1);
  const limit = 5;

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
