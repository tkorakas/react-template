import { Field, RadioGroup as ChakraRadioGroup, Stack } from '@chakra-ui/react';
import { Controller, useFormContext } from 'react-hook-form';

type Option = {
  value: string;
  label: string;
};

type RadioGroupProps = {
  name: string;
  label: string;
  options: Option[];
  testId?: string;
  formatError?: (message?: string) => string | undefined;
};

export function RadioGroup({
  name,
  label,
  options,
  testId,
  formatError,
}: RadioGroupProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const errorMessage = formatError
          ? formatError(fieldState.error?.message)
          : fieldState.error?.message;

        return (
          <Field.Root invalid={!!errorMessage}>
            <ChakraRadioGroup.Root
              name={name}
              value={field.value ?? ''}
              onValueChange={event => {
                if (!event.value) {
                  return;
                }

                field.onChange(event.value);
                field.onBlur();
              }}
            >
              <Field.Label>{label}</Field.Label>
              <Stack gap={3} align="start">
                {options.map(option => (
                  <ChakraRadioGroup.Item
                    key={option.value}
                    value={option.value}
                    data-testid={
                      testId ? `${testId}-${option.value}` : undefined
                    }
                  >
                    <ChakraRadioGroup.ItemHiddenInput />
                    <ChakraRadioGroup.ItemIndicator />
                    <ChakraRadioGroup.ItemText>
                      {option.label}
                    </ChakraRadioGroup.ItemText>
                  </ChakraRadioGroup.Item>
                ))}
              </Stack>
            </ChakraRadioGroup.Root>
            <Field.ErrorText>{errorMessage}</Field.ErrorText>
          </Field.Root>
        );
      }}
    />
  );
}
