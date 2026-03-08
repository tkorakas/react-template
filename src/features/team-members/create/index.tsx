import { Button, Stack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Drawer, Radio, SimpleForm, TextInput } from '~/common/ui';
import { useCreateTeamMemberHandler } from './use-handler';

export default function CreateTeamMemberPage() {
  const { t } = useTranslation('team-members');
  const { form, isLoading, handleSubmit, handleClose } =
    useCreateTeamMemberHandler();

  return (
    <Drawer title={t('create.title')} isOpen={true} onClose={handleClose}>
      <SimpleForm onSubmit={handleSubmit}>
        <Stack gap={4}>
          <TextInput
            {...form.register('name')}
            label={t('create.name')}
            placeholder={t('create.namePlaceholder')}
            error={form.formState.errors.name?.message}
          />

          <TextInput
            {...form.register('role')}
            label={t('create.role')}
            placeholder={t('create.rolePlaceholder')}
            error={form.formState.errors.role?.message}
          />

          <Radio
            label={t('create.status')}
            options={[
              { value: 'Active', label: t('status.active') },
              { value: 'Pending', label: t('status.pending') },
              { value: 'Inactive', label: t('status.inactive') },
            ]}
            defaultValue={form.watch('status')}
            onChange={value =>
              form.setValue(
                'status',
                value as 'Active' | 'Pending' | 'Inactive'
              )
            }
            error={form.formState.errors.status?.message}
          />

          <Button type="submit" colorScheme="blue" loading={isLoading} mt={4}>
            {t('create.submit')}
          </Button>
        </Stack>
      </SimpleForm>
    </Drawer>
  );
}
