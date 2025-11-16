import { Alert, Box, Button, Heading, Stack, Text } from '@chakra-ui/react';
import { SimpleForm, TextInput } from '~/ui';
import { useMfaHandler } from './use-handler';

export default function MfaPage() {
  const { form, isLoading, handleSubmit, error } = useMfaHandler();

  return (
    <Box>
      <Stack gap={6}>
        <Box textAlign="center">
          <Heading size="lg" mb={2}>
            Two-Factor Authentication
          </Heading>
          <Text color="gray.600">
            Enter the 4-digit code from your authenticator app
          </Text>
        </Box>

        {error && (
          <Alert.Root status="error">
            <Alert.Description>
              MFA verification failed: {error.message}
            </Alert.Description>
          </Alert.Root>
        )}

        <SimpleForm onSubmit={handleSubmit}>
          <TextInput
            {...form.register('otp')}
            type="text"
            label="Verification Code"
            placeholder="0000"
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
            loadingText="Verifying..."
            colorScheme="blue"
            size="lg"
          >
            Verify Code
          </Button>
        </SimpleForm>

        <Box textAlign="center">
          <Text fontSize="sm" color="gray.600">
            Check your console for the generated OTP code during development
          </Text>
        </Box>
      </Stack>
    </Box>
  );
}
