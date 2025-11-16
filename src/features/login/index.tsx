import {
  Box,
  Button,
  Heading,
  HStack,
  Separator,
  Stack,
  Text,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { OAuthButton } from '~/common/auth';
import { SimpleForm, TextInput } from '~/ui';
import { useLoginHandler } from './use-handler';

export default function LoginPage() {
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
            Welcome Back
          </Heading>
          <Text color="gray.600">Please sign in to your account</Text>
        </Box>
        <SimpleForm onSubmit={handleSubmit}>
          <TextInput
            type="email"
            label="Email"
            placeholder="Enter your email"
            error={errors.email?.message}
            {...register('email')}
          />

          <TextInput
            type="password"
            label="Password"
            placeholder="Enter your password"
            error={errors.password?.message}
            {...register('password')}
          />

          <Button
            type="submit"
            colorScheme="blue"
            size="lg"
            loading={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
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
              OR
            </Text>
          </Box>
        </Box>

        <OAuthButton provider="github">Sign in with GitHub</OAuthButton>

        <Box textAlign="center">
          <HStack justify="center" gap={1}>
            <Text fontSize="sm" color="gray.600">
              Don&apos;t have an account?
            </Text>
            <Link
              to="/register"
              style={{ color: 'var(--chakra-colors-blue-500)' }}
            >
              <Button variant="plain" colorScheme="blue" size="sm" p={0}>
                Sign up here
              </Button>
            </Link>
          </HStack>
        </Box>
      </Stack>
    </Box>
  );
}
