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
import { useRegisterHandler } from './use-handler';

export default function RegisterPage() {
  const { form, isLoading, handleSubmit } = useRegisterHandler();

  return (
    <Box>
      <Stack gap={6}>
        <Box textAlign="center">
          <Heading size="lg" mb={2}>
            Create Account
          </Heading>
          <Text color="gray.600">Sign up for a new account</Text>
        </Box>

        <SimpleForm onSubmit={handleSubmit}>
          <TextInput
            {...form.register('name')}
            type="text"
            label="Full Name"
            placeholder="Enter your full name"
            disabled={isLoading}
            error={form.formState.errors.name?.message}
          />

          <TextInput
            {...form.register('email')}
            type="email"
            label="Email"
            placeholder="Enter your email"
            disabled={isLoading}
            error={form.formState.errors.email?.message}
          />

          <TextInput
            {...form.register('password')}
            type="password"
            label="Password"
            placeholder="Enter your password"
            disabled={isLoading}
            error={form.formState.errors.password?.message}
          />

          <Button
            type="submit"
            loading={isLoading}
            loadingText="Creating account..."
            colorScheme="blue"
            size="lg"
          >
            Create Account
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
              Already have an account?
            </Text>
            <Link
              to="/login"
              style={{ color: 'var(--chakra-colors-blue-500)' }}
            >
              <Button variant="plain" colorScheme="blue" size="sm" p={0}>
                Sign in here
              </Button>
            </Link>
          </HStack>
        </Box>
      </Stack>
    </Box>
  );
}
