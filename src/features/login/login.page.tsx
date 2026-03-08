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
import { useLoginHandler } from './login.handler';

export default function LoginPage() {
  const { t } = useTranslation('login');
  const { t: tAuth } = useTranslation('auth');
  const { form, handleSubmit, isLoading } = useLoginHandler();

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <Box>
      <Stack gap={6}>
        <Box textAlign="center">
          <Heading size="lg" mb={2}>
            {tAuth('welcome')}
          </Heading>
          <Text color="gray.600">{tAuth('signIn')}</Text>
        </Box>
        <SimpleForm onSubmit={handleSubmit}>
          <TextInput
            type="email"
            label={t('email')}
            placeholder={t('emailPlaceholder')}
            error={errors.email?.message}
            {...register('email')}
          />

          <TextInput
            type="password"
            label={t('password')}
            placeholder={t('passwordPlaceholder')}
            error={errors.password?.message}
            {...register('password')}
          />

          <Button
            type="submit"
            colorScheme="blue"
            size="lg"
            loading={isLoading}
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
              {tAuth('noAccount')}
            </Text>
            <Link
              to="/register"
              style={{ color: 'var(--chakra-colors-blue-500)' }}
            >
              <Button variant="plain" colorScheme="blue" size="sm" p={0}>
                {tAuth('register')}
              </Button>
            </Link>
          </HStack>
        </Box>
      </Stack>
    </Box>
  );
}
