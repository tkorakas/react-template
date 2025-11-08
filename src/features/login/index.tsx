import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useLoginHandler } from './use-handler';

export default function LoginPage() {
  const { form, handleSubmit, isLoading, error } = useLoginHandler();

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <Container maxW="md" py={12}>
      <Box borderWidth="1px" borderRadius="lg" boxShadow="lg" p={8} bg="white">
        <Stack gap={6}>
          <Box textAlign="center">
            <Heading size="lg" mb={2}>
              Welcome Back
            </Heading>
            <Text color="gray.600">Please sign in to your account</Text>
          </Box>

          {error && (
            <Box
              p={4}
              bg="red.50"
              borderRadius="md"
              borderLeftWidth="4px"
              borderLeftColor="red.500"
            >
              <Text color="red.700" fontSize="sm">
                {error}
              </Text>
            </Box>
          )}

          <Stack as="form" onSubmit={handleSubmit} gap={4}>
            <Box>
              <Text mb={2} fontSize="sm" fontWeight="medium">
                Email
              </Text>
              <Input
                type="email"
                placeholder="Enter your email"
                {...register('email')}
                borderColor={errors.email ? 'red.500' : 'gray.300'}
              />
              {errors.email && (
                <Text color="red.500" fontSize="sm" mt={1}>
                  {errors.email.message}
                </Text>
              )}
            </Box>

            <Box>
              <Text mb={2} fontSize="sm" fontWeight="medium">
                Password
              </Text>
              <Input
                type="password"
                placeholder="Enter your password"
                {...register('password')}
                borderColor={errors.password ? 'red.500' : 'gray.300'}
              />
              {errors.password && (
                <Text color="red.500" fontSize="sm" mt={1}>
                  {errors.password.message}
                </Text>
              )}
            </Box>

            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              loading={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </Stack>

          <Box textAlign="center">
            <HStack justify="center" gap={1}>
              <Text fontSize="sm" color="gray.600">
                Don&apos;t have an account?
              </Text>
              <Button variant="plain" colorScheme="blue" size="sm" p={0}>
                Sign up here
              </Button>
            </HStack>
          </Box>
        </Stack>
      </Box>
    </Container>
  );
}
