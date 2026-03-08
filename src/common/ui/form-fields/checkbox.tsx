import { Checkbox as ChakraCheckbox, Field } from '@chakra-ui/react';
import { Controller, useFormContext } from 'react-hook-form';

type CheckboxProps = {
  name: string;
  label: string;
  testId?: string;
};

export function Checkbox({ name, label, testId }: CheckboxProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field.Root invalid={!!fieldState.error}>
          <ChakraCheckbox.Root
            checked={field.value}
            onCheckedChange={e => field.onChange(!!e.checked)}
            data-testid={testId}
          >
            <ChakraCheckbox.HiddenInput />
            <ChakraCheckbox.Control />
            <ChakraCheckbox.Label>{label}</ChakraCheckbox.Label>
          </ChakraCheckbox.Root>
          <Field.ErrorText>{fieldState.error?.message}</Field.ErrorText>
        </Field.Root>
      )}
    />
  );
}
