import { Alert, Box, Button, Card, Flex, Input, Text } from '@chakra-ui/react';
import { useMfaHandler } from './use-handler';

export default function MfaPage() {
  const { form, isLoading, handleSubmit, error } = useMfaHandler();

  return (
    <Flex minHeight="100vh" align="center" justify="center" bg="gray.50">
      <Box width="full" maxWidth="md" px={6}>
        <Card.Root>
          <Card.Header>
            <Card.Title>Two-Factor Authentication</Card.Title>
            <Card.Description>
              Enter the 4-digit code from your authenticator app
            </Card.Description>
          </Card.Header>
          <Card.Body>
            <form onSubmit={handleSubmit}>
              <Flex direction="column" gap={4}>
                {error && (
                  <Alert.Root status="error">
                    <Alert.Description>
                      MFA verification failed: {error.message}
                    </Alert.Description>
                  </Alert.Root>
                )}

                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={2}>
                    Verification Code
                  </Text>
                  <Input
                    {...form.register('otp')}
                    type="text"
                    placeholder="0000"
                    disabled={isLoading}
                    maxLength={4}
                    textAlign="center"
                    fontSize="2xl"
                    fontWeight="bold"
                    letterSpacing="0.5em"
                  />
                  {form.formState.errors.otp && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {form.formState.errors.otp.message}
                    </Text>
                  )}
                </Box>

                <Button
                  type="submit"
                  loading={isLoading}
                  loadingText="Verifying..."
                  width="full"
                >
                  Verify Code
                </Button>
              </Flex>
            </form>
          </Card.Body>
          <Card.Footer>
            <Text
              fontSize="sm"
              textAlign="center"
              width="full"
              color="gray.600"
            >
              Check your console for the generated OTP code during development
            </Text>
          </Card.Footer>
        </Card.Root>
      </Box>
    </Flex>
  );
}
