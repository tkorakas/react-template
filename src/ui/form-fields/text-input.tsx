import { Box, Input, Text } from '@chakra-ui/react';
import type { ComponentProps, ForwardedRef } from 'react';
import { forwardRef } from 'react';

type TextInputProps = {
  error?: string;
  label: string;
} & ComponentProps<typeof Input>;

export const TextInput = forwardRef(function TextInput(
  { error, label, ...rest }: TextInputProps,
  ref: ForwardedRef<HTMLInputElement>
) {
  return (
    <Box>
      <Text mb={2} fontSize="sm" fontWeight="medium">
        {label}
      </Text>
      <Input {...rest} ref={ref} borderColor={error ? 'red.500' : 'gray.300'} />
      {error && (
        <Text color="red.500" fontSize="sm" mt={1}>
          {error}
        </Text>
      )}
    </Box>
  );
});
