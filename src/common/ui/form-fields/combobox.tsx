import {
  Combobox as ChakraCombobox,
  Field,
  Portal,
  createListCollection,
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

type ComboboxOption = {
  label: string;
  value: string;
};

type ComboboxProps = {
  name: string;
  label?: string;
  options: ComboboxOption[];
  placeholder?: string;
  testId?: string;
  openOnClick?: boolean;
  disabled?: boolean;
};

export function Combobox({
  name,
  label,
  options,
  placeholder,
  testId,
  openOnClick = true,
  disabled,
}: ComboboxProps) {
  const { control } = useFormContext();
  const [inputValue, setInputValue] = useState('');

  const filteredOptions = useMemo(() => {
    if (!inputValue) return options;
    return options.filter(option =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [options, inputValue]);

  const collection = useMemo(
    () => createListCollection({ items: filteredOptions }),
    [filteredOptions]
  );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field.Root invalid={!!fieldState.error}>
          <ChakraCombobox.Root
            collection={collection}
            value={field.value ? [field.value] : []}
            onValueChange={e => {
              field.onChange(e.value[0] ?? '');
              setInputValue('');
            }}
            onInputValueChange={e => setInputValue(e.inputValue)}
            onInteractOutside={() => field.onBlur()}
            openOnClick={openOnClick}
            disabled={disabled}
            data-testid={testId}
          >
            {label && <ChakraCombobox.Label>{label}</ChakraCombobox.Label>}
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
                  <ChakraCombobox.Empty>
                    {placeholder ?? 'No items found'}
                  </ChakraCombobox.Empty>
                  {collection.items.map(option => (
                    <ChakraCombobox.Item item={option} key={option.value}>
                      {option.label}
                      <ChakraCombobox.ItemIndicator />
                    </ChakraCombobox.Item>
                  ))}
                </ChakraCombobox.Content>
              </ChakraCombobox.Positioner>
            </Portal>
          </ChakraCombobox.Root>
          <Field.ErrorText>{fieldState.error?.message}</Field.ErrorText>
        </Field.Root>
      )}
    />
  );
}
