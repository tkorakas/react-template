import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { ColumnDef } from '~/common/ui';
import type { TeamMember } from '~/data-access/team-members/team-members.schema';

const statusKeyByValue: Record<TeamMember['status'], string> = {
  Active: 'active',
  Pending: 'pending',
  Inactive: 'inactive',
};

export function useTeamMembersColumns() {
  const { t } = useTranslation('team-members');

  return useMemo<ColumnDef<TeamMember>[]>(
    () => [
      { accessorKey: 'name', header: t('columns.name') },
      { accessorKey: 'role', header: t('columns.role') },
      {
        accessorKey: 'status',
        header: t('columns.status'),
        cell: info =>
          t(
            `status.${statusKeyByValue[info.getValue() as TeamMember['status']]}`
          ),
      },
    ],
    [t]
  );
}
