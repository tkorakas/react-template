import { Button, Stack } from '@chakra-ui/react';
import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Drawer, RadioGroup, SimpleForm, TextInput } from '~/common/ui';
import { useCreateTeamMemberHandler } from './create-team-member.handler';

export default function CreateTeamMemberPage() {
  const { t } = useTranslation('team-members');
  const { form, isLoading, handleSubmit, handleClose } =
    useCreateTeamMemberHandler();

  return (
    <Drawer title={t('create.title')} isOpen={true} onClose={handleClose}>
      <FormProvider {...form}>
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

            <RadioGroup
              name="status"
              label={t('create.status')}
              options={[
                { value: 'Active', label: t('status.active') },
                { value: 'Pending', label: t('status.pending') },
                { value: 'Inactive', label: t('status.inactive') },
              ]}
            />

            <Button type="submit" colorScheme="blue" loading={isLoading} mt={4}>
              {t('create.submit')}
            </Button>
          </Stack>
        </SimpleForm>
      </FormProvider>
    </Drawer>
  );
}
