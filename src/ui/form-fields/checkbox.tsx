import { Box, HStack, Text, VStack } from '@chakra-ui/react';
import type { ForwardedRef } from 'react';
import { forwardRef, useState } from 'react';

type Option = {
  value: string;
  label: string;
};

type CheckboxProps = {
  error?: string;
  label: string;
  name: string;
  defaultValue?: string[];
  options: Option[];
  onChange?: (values: string[]) => void;
};

export const Checkbox = forwardRef(function Checkbox(
  { error, label, defaultValue = [], options, name, onChange }: CheckboxProps,
  ref: ForwardedRef<HTMLInputElement>
) {
  const [selectedValues, setSelectedValues] = useState<string[]>(defaultValue);

  const handleChange = (optionValue: string, checked: boolean) => {
    const newValues = checked
      ? [...selectedValues, optionValue]
      : selectedValues.filter(value => value !== optionValue);

    setSelectedValues(newValues);
    onChange?.(newValues);
  };

  return (
    <Box>
      <Text mb={2} fontSize="sm" fontWeight="medium">
        {label}
      </Text>
      <HStack spaceX={{ base: 0, md: 4 }}>
        <VStack hideFrom="md" align="start">
          {options.map(option => (
            <Box key={option.value} display="flex" alignItems="center">
              <input
                ref={ref}
                type="checkbox"
                name={name}
                value={option.value}
                checked={selectedValues.includes(option.value)}
                onChange={e => handleChange(option.value, e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              <Text>{option.label}</Text>
            </Box>
          ))}
        </VStack>
        <HStack hideBelow="md">
          {options.map(option => (
            <Box key={option.value} display="flex" alignItems="center">
              <input
                ref={ref}
                type="checkbox"
                name={name}
                value={option.value}
                checked={selectedValues.includes(option.value)}
                onChange={e => handleChange(option.value, e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              <Text>{option.label}</Text>
            </Box>
          ))}
        </HStack>
      </HStack>
      {error && (
        <Text color="red.500" fontSize="sm" mt={1}>
          {error}
        </Text>
      )}
    </Box>
  );
});
