import { Box, Spinner, Text, VStack } from '@chakra-ui/react';
import { useOAuthHandler } from './use-handler';

export default function OAuthCallbackPage() {
  useOAuthHandler();

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <VStack gap={4}>
        <Spinner size="lg" />
        <Text fontSize="lg" color="gray.600">
          Completing sign in...
        </Text>
      </VStack>
    </Box>
  );
}
