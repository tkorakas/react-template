import {
  Alert,
  Box,
  Button,
  Card,
  Flex,
  Input,
  Separator,
  Text,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { OAuthButton } from '~/common/auth';
import { useRegisterHandler } from './use-handler';

export default function RegisterPage() {
  const { form, isLoading, handleSubmit, error } = useRegisterHandler();

  return (
    <Flex minHeight="100vh" align="center" justify="center" bg="gray.50">
      <Box width="full" maxWidth="md" px={6}>
        <Card.Root>
          <Card.Header>
            <Card.Title>Create Account</Card.Title>
            <Card.Description>Sign up for a new account</Card.Description>
          </Card.Header>
          <Card.Body>
            <form onSubmit={handleSubmit}>
              <Flex direction="column" gap={4}>
                {error && (
                  <Alert.Root status="error">
                    <Alert.Description>
                      Registration failed: {error.message}
                    </Alert.Description>
                  </Alert.Root>
                )}

                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={2}>
                    Full Name
                  </Text>
                  <Input
                    {...form.register('name')}
                    type="text"
                    placeholder="Enter your full name"
                    disabled={isLoading}
                  />
                  {form.formState.errors.name && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {form.formState.errors.name.message}
                    </Text>
                  )}
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={2}>
                    Email
                  </Text>
                  <Input
                    {...form.register('email')}
                    type="email"
                    placeholder="Enter your email"
                    disabled={isLoading}
                  />
                  {form.formState.errors.email && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {form.formState.errors.email.message}
                    </Text>
                  )}
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={2}>
                    Password
                  </Text>
                  <Input
                    {...form.register('password')}
                    type="password"
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                  {form.formState.errors.password && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {form.formState.errors.password.message}
                    </Text>
                  )}
                </Box>

                <Button
                  type="submit"
                  loading={isLoading}
                  loadingText="Creating account..."
                  width="full"
                >
                  Create Account
                </Button>
              </Flex>
            </form>

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
          </Card.Body>
          <Card.Footer>
            <Text fontSize="sm" textAlign="center" width="full">
              Already have an account?{' '}
              <Link
                to="/login"
                style={{ color: 'var(--chakra-colors-blue-500)' }}
              >
                Sign in
              </Link>
            </Text>
          </Card.Footer>
        </Card.Root>
      </Box>
    </Flex>
  );
}
