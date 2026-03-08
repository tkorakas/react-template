import {
  Box,
  Field,
  Flex,
  Portal,
  Select as ChakraSelect,
  createListCollection,
} from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

type SelectOption = {
  label: string;
  value: string;
  dotColor?: string;
};

type SelectProps = {
  name: string;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  testId?: string;
};

export function Select({
  name,
  label,
  options,
  placeholder,
  testId,
}: SelectProps) {
  const { control } = useFormContext();
  const collection = createListCollection({ items: options });

  const renderOptionLabel = (option: SelectOption): ReactNode => {
    if (!option.dotColor) {
      return option.label;
    }

    return (
      <Flex align="center" gap={2} minW="0">
        <Box boxSize="2" borderRadius="full" bg={option.dotColor} />
        <Box as="span" truncate>
          {option.label}
        </Box>
      </Flex>
    );
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const selectedOption = options.find(
          option => option.value === field.value
        );

        return (
          <Field.Root invalid={!!fieldState.error}>
            <ChakraSelect.Root
              collection={collection}
              value={field.value ? [field.value] : []}
              onValueChange={e => field.onChange(e.value[0])}
              data-testid={testId}
            >
              <ChakraSelect.HiddenSelect />
              <ChakraSelect.Label>{label}</ChakraSelect.Label>
              <ChakraSelect.Control>
                <ChakraSelect.Trigger>
                  {selectedOption ? (
                    renderOptionLabel(selectedOption)
                  ) : (
                    <ChakraSelect.ValueText placeholder={placeholder} />
                  )}
                </ChakraSelect.Trigger>
                <ChakraSelect.IndicatorGroup>
                  <ChakraSelect.Indicator />
                </ChakraSelect.IndicatorGroup>
              </ChakraSelect.Control>
              <Portal>
                <ChakraSelect.Positioner style={{ zIndex: 1600 }}>
                  <ChakraSelect.Content>
                    {options.map(option => (
                      <ChakraSelect.Item item={option} key={option.value}>
                        {renderOptionLabel(option)}
                        <ChakraSelect.ItemIndicator />
                      </ChakraSelect.Item>
                    ))}
                  </ChakraSelect.Content>
                </ChakraSelect.Positioner>
              </Portal>
            </ChakraSelect.Root>
            <Field.ErrorText>{fieldState.error?.message}</Field.ErrorText>
          </Field.Root>
        );
      }}
    />
  );
}
