import { Alert, Box, Button, Heading, Stack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { SimpleForm, TextInput } from '~/common/ui';
import { useMfaHandler } from './use-handler';

export default function MfaPage() {
  const { t } = useTranslation('mfa');
  const { form, isLoading, handleSubmit, error } = useMfaHandler();

  return (
    <Box>
      <Stack gap={6}>
        <Box textAlign="center">
          <Heading size="lg" mb={2}>
            {t('title')}
          </Heading>
          <Text color="gray.600">{t('description')}</Text>
        </Box>

        {error && (
          <Alert.Root status="error">
            <Alert.Description>
              {t('errors.invalidCode')}: {error.message}
            </Alert.Description>
          </Alert.Root>
        )}

        <SimpleForm onSubmit={handleSubmit}>
          <TextInput
            {...form.register('otp')}
            type="text"
            label={t('code')}
            placeholder={t('codePlaceholder')}
            disabled={isLoading}
            error={form.formState.errors.otp?.message}
            maxLength={4}
            textAlign="center"
            fontSize="2xl"
            fontWeight="bold"
            letterSpacing="0.5em"
          />

          <Button
            type="submit"
            loading={isLoading}
            colorScheme="blue"
            size="lg"
          >
            {t('submit')}
          </Button>
        </SimpleForm>

        <Box textAlign="center">
          <Text fontSize="sm" color="gray.600">
            {t('resend')}
          </Text>
        </Box>
      </Stack>
    </Box>
  );
}
