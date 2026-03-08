import {
  Badge,
  Combobox as ChakraCombobox,
  CloseButton,
  Field,
  HStack,
  Portal,
  Span,
  Spinner,
  Wrap,
  useListCollection,
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

type AsyncMultiComboboxOption = {
  label: string;
  value: string;
};

type AsyncMultiComboboxProps = {
  name: string;
  label?: string;
  placeholder?: string;
  options: AsyncMultiComboboxOption[];
  isLoading?: boolean;
  isError?: boolean;
  testId?: string;
};

export function AsyncMultiCombobox({
  name,
  label,
  placeholder,
  options,
  isLoading = false,
  isError = false,
  testId,
}: AsyncMultiComboboxProps) {
  const { control } = useFormContext();
  const [inputValue, setInputValue] = useState('');

  const filteredOptions = useMemo(() => {
    if (!inputValue) return options;
    return options.filter(option =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [options, inputValue]);

  const { collection, set } = useListCollection<AsyncMultiComboboxOption>({
    initialItems: filteredOptions,
    itemToString: item => item.label,
    itemToValue: item => item.value,
  });

  useEffect(() => {
    set(filteredOptions);
  }, [filteredOptions, set]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const selectedItems = options.filter(opt =>
          (field.value as string[])?.includes(opt.value)
        );

        const handleRemove = (valueToRemove: string) => {
          const newValue = (field.value as string[]).filter(
            v => v !== valueToRemove
          );
          field.onChange(newValue);
        };

        return (
          <Field.Root invalid={!!fieldState.error}>
            <ChakraCombobox.Root
              multiple
              closeOnSelect
              openOnClick
              collection={collection}
              value={field.value ?? []}
              onValueChange={e => field.onChange(e.value)}
              onInputValueChange={e => setInputValue(e.inputValue)}
              onInteractOutside={() => field.onBlur()}
              data-testid={testId}
            >
              {label && <ChakraCombobox.Label>{label}</ChakraCombobox.Label>}

              {selectedItems.length > 0 && (
                <Wrap gap={2} mb={2}>
                  {selectedItems.map(item => (
                    <Badge key={item.value} variant="subtle" colorPalette="blue" pe={1}>
                      {item.label}
                      <CloseButton
                        size="2xs"
                        ms={1}
                        onClick={() => handleRemove(item.value)}
                      />
                    </Badge>
                  ))}
                </Wrap>
              )}

              <ChakraCombobox.Control>
                <ChakraCombobox.Input placeholder={placeholder} />
                <ChakraCombobox.IndicatorGroup>
                  <ChakraCombobox.ClearTrigger />
                  <ChakraCombobox.Trigger />
                </ChakraCombobox.IndicatorGroup>
              </ChakraCombobox.Control>

              <Portal>
                <ChakraCombobox.Positioner style={{ zIndex: 1600 }}>
                  <ChakraCombobox.Content>
                    {isLoading ? (
                      <HStack p={2}>
                        <Spinner size="xs" borderWidth="1px" />
                        <Span>Loading...</Span>
                      </HStack>
                    ) : isError ? (
                      <Span p={2} color="red.500">
                        Error loading options
                      </Span>
                    ) : collection.items.length === 0 ? (
                      <ChakraCombobox.Empty>
                        {placeholder ?? 'No items found'}
                      </ChakraCombobox.Empty>
                    ) : (
                      collection.items.map(option => (
                        <ChakraCombobox.Item item={option} key={option.value}>
                          {option.label}
                          <ChakraCombobox.ItemIndicator />
                        </ChakraCombobox.Item>
                      ))
                    )}
                  </ChakraCombobox.Content>
                </ChakraCombobox.Positioner>
              </Portal>
            </ChakraCombobox.Root>
            <Field.ErrorText>{fieldState.error?.message}</Field.ErrorText>
          </Field.Root>
        );
      }}
    />
  );
}
