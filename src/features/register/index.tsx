import {
  Box,
  Button,
  Heading,
  HStack,
  Separator,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { OAuthButton } from '~/common/auth';
import { SimpleForm, TextInput } from '~/common/ui';
import { useRegisterHandler } from './use-handler';

export default function RegisterPage() {
  const { t } = useTranslation('register');
  const { t: tAuth } = useTranslation('auth');
  const { form, isLoading, handleSubmit } = useRegisterHandler();

  return (
    <Box>
      <Stack gap={6}>
        <Box textAlign="center">
          <Heading size="lg" mb={2}>
            {t('title')}
          </Heading>
          <Text color="gray.600">{tAuth('signIn')}</Text>
        </Box>

        <SimpleForm onSubmit={handleSubmit}>
          <TextInput
            {...form.register('name')}
            type="text"
            label={t('name')}
            placeholder={t('namePlaceholder')}
            disabled={isLoading}
            error={form.formState.errors.name?.message}
          />

          <TextInput
            {...form.register('email')}
            type="email"
            label={t('email')}
            placeholder={t('emailPlaceholder')}
            disabled={isLoading}
            error={form.formState.errors.email?.message}
          />

          <TextInput
            {...form.register('password')}
            type="password"
            label={t('password')}
            placeholder={t('passwordPlaceholder')}
            disabled={isLoading}
            error={form.formState.errors.password?.message}
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

        <Box position="relative" textAlign="center" my={6}>
          <Separator />
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            bg="white"
            px={3}
          >
            <Text fontSize="sm" color="gray.500">
              {tAuth('orContinueWith')}
            </Text>
          </Box>
        </Box>

        <OAuthButton provider="github">
          {tAuth('orContinueWith')} GitHub
        </OAuthButton>

        <Box textAlign="center">
          <HStack justify="center" gap={1}>
            <Text fontSize="sm" color="gray.600">
              {t('hasAccount')}
            </Text>
            <Link
              to="/login"
              style={{ color: 'var(--chakra-colors-blue-500)' }}
            >
              <Button variant="plain" colorScheme="blue" size="sm" p={0}>
                {t('login')}
              </Button>
            </Link>
          </HStack>
        </Box>
      </Stack>
    </Box>
  );
}
