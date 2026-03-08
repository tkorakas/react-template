import { Checkbox as ChakraCheckbox, Stack, Text } from '@chakra-ui/react';
import { Controller, useFormContext } from 'react-hook-form';

type MultiCheckboxOption = {
  label: string;
  value: string;
};

type MultiCheckboxProps = {
  name: string;
  label: string;
  options: MultiCheckboxOption[];
  testId?: string;
  formatError?: (message?: string) => string | undefined;
};

export function MultiCheckbox({
  name,
  label,
  options,
  testId,
  formatError,
}: MultiCheckboxProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const selectedValues = Array.isArray(field.value) ? field.value : [];

        const getNextValues = (value: string, checked: boolean) => {
          const hasValue = selectedValues.includes(value);
          if (checked) {
            return hasValue ? selectedValues : [...selectedValues, value];
          }
          return selectedValues.filter(
            (currentValue: string) => currentValue !== value
          );
        };

        const errorMessage = formatError
          ? formatError(fieldState.error?.message)
          : fieldState.error?.message;

        return (
          <Stack gap={2}>
            <Text fontWeight="medium">{label}</Text>
            <Stack gap={3}>
              {options.map(option => (
                <ChakraCheckbox.Root
                  key={option.value}
                  name={name}
                  value={option.value}
                  checked={selectedValues.includes(option.value)}
                  onCheckedChange={event => {
                    field.onChange(
                      getNextValues(option.value, !!event.checked)
                    );
                    field.onBlur();
                  }}
                  data-testid={testId ? `${testId}-${option.value}` : undefined}
                >
                  <ChakraCheckbox.HiddenInput />
                  <ChakraCheckbox.Control />
                  <ChakraCheckbox.Label>{option.label}</ChakraCheckbox.Label>
                </ChakraCheckbox.Root>
              ))}
            </Stack>
            {errorMessage ? <Text color="fg.error">{errorMessage}</Text> : null}
          </Stack>
        );
      }}
    />
  );
}
