import { Checkbox, Field, HStack, VStack } from '@chakra-ui/react';
import type { ComponentProps, ForwardedRef } from 'react';
import { forwardRef } from 'react';

type Option = {
  value: string;
  label: string;
};

type CheckboxGroupProps = {
  error?: string;
  label: string;
  name: string;
  options: Option[];
  selectedValues?: string[];
  onValueChange?: (value: string[]) => void;
} & Omit<ComponentProps<typeof Checkbox.Root>, 'children'>;

export const CheckboxGroup = forwardRef(function CheckboxGroup(
  {
    error,
    label,
    options,
    name,
    selectedValues = [],
    onValueChange,
    ...rest
  }: CheckboxGroupProps,
  ref: ForwardedRef<HTMLInputElement>
) {
  const handleCheckedChange = (checked: boolean, optionValue: string) => {
    const nextValues = checked
      ? Array.from(new Set([...selectedValues, optionValue]))
      : selectedValues.filter(item => item !== optionValue);

    onValueChange?.(nextValues);
  };

  return (
    <Field.Root invalid={!!error}>
      <Field.Label>{label}</Field.Label>
      <HStack gap={{ base: 0, md: 4 }} align="start">
        <VStack hideFrom="md" align="start">
          {options.map(option => (
            <Checkbox.Root
              key={option.value}
              name={name}
              value={option.value}
              checked={selectedValues.includes(option.value)}
              onCheckedChange={e =>
                handleCheckedChange(!!e.checked, option.value)
              }
              {...rest}
            >
              <Checkbox.HiddenInput ref={ref} />
              <Checkbox.Control />
              <Checkbox.Label>{option.label}</Checkbox.Label>
            </Checkbox.Root>
          ))}
        </VStack>
        <HStack hideBelow="md" gap={4}>
          {options.map(option => (
            <Checkbox.Root
              key={option.value}
              name={name}
              value={option.value}
              checked={selectedValues.includes(option.value)}
              onCheckedChange={e =>
                handleCheckedChange(!!e.checked, option.value)
              }
              {...rest}
            >
              <Checkbox.HiddenInput ref={ref} />
              <Checkbox.Control />
              <Checkbox.Label>{option.label}</Checkbox.Label>
            </Checkbox.Root>
          ))}
        </HStack>
      </HStack>
      <Field.ErrorText>{error}</Field.ErrorText>
    </Field.Root>
  );
});
