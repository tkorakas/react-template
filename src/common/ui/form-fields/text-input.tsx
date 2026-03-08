import { Field, Input, InputGroup } from '@chakra-ui/react';
import type { ComponentProps, ForwardedRef, ReactNode } from 'react';
import { forwardRef } from 'react';

type TextInputProps = {
  error?: string;
  label: string;
  testId?: string;
  endAddon?: ReactNode;
} & ComponentProps<typeof Input>;

export const TextInput = forwardRef(function TextInput(
  { error, testId, endAddon, ...rest }: TextInputProps,
  ref: ForwardedRef<HTMLInputElement>
) {
  const inputElement = <Input {...rest} ref={ref} data-testid={testId} />;

  return (
    <Field.Root invalid={!!error}>
      <Field.Label>{rest.label}</Field.Label>
      {endAddon ? (
        <InputGroup endAddon={endAddon}>{inputElement}</InputGroup>
      ) : (
        inputElement
      )}
      <Field.ErrorText>{error}</Field.ErrorText>
    </Field.Root>
  );
});
