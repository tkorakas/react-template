import { ActionBar, Button, Menu, Portal } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useDialog } from '../feedback/use-dialog';

interface StatusOption {
  value: string;
  label: string;
}

interface TableActionBarProps {
  selectedCount: number;
  statusOptions: StatusOption[];
  onStatusChange: (status: string) => void;
  confirmTitle: string;
  confirmDescriptionTemplate: string;
  buttonLabel?: string;
}

type SelectDetails = {
  value: string;
};

export function TableActionBar({
  selectedCount,
  statusOptions,
  onStatusChange,
  confirmTitle,
  confirmDescriptionTemplate,
  buttonLabel,
}: TableActionBarProps) {
  const { t } = useTranslation('common');
  const dialog = useDialog();

  return (
    <ActionBar.Root open={selectedCount > 0}>
      <Portal>
        <ActionBar.Positioner>
          <ActionBar.Content>
            <ActionBar.SelectionTrigger>
              {t('table.selectedCount', { count: selectedCount })}
            </ActionBar.SelectionTrigger>
            <ActionBar.Separator />
            <Menu.Root
              unmountOnExit={true}
              closeOnSelect
              onSelect={(details: SelectDetails) => {
                const selectedOption = statusOptions.find(
                  opt => opt.value === details.value
                );
                const statusLabel = selectedOption?.label ?? details.value;
                dialog.openDialog({
                  title: confirmTitle,
                  description: confirmDescriptionTemplate.replace(
                    '{status}',
                    statusLabel
                  ),
                  actionLabel: t('actions.confirm'),
                  onSuccess: () => {
                    onStatusChange(details.value);
                  },
                });
              }}
            >
              <Menu.Trigger asChild>
                <Button size="sm">{buttonLabel ?? t('actions.markAs')}</Button>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content>
                    {statusOptions.map(option => (
                      <Menu.Item key={option.value} value={option.value}>
                        {option.label}
                      </Menu.Item>
                    ))}
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          </ActionBar.Content>
        </ActionBar.Positioner>
      </Portal>
    </ActionBar.Root>
  );
}
