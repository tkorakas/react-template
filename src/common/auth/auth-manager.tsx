import { Box, Spinner, Text, VStack } from '@chakra-ui/react';
import type { PropsWithChildren } from 'react';
import { useAuth } from './use-auth';

export function AuthManager({ children }: PropsWithChildren) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box
        height="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack gap={4}>
          <Spinner size="xl" color="blue.500" />
          <Text color="gray.600">Loading...</Text>
        </VStack>
      </Box>
    );
  }

  return <>{children}</>;
}
