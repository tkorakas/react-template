import { Box, HStack, Text, VStack } from '@chakra-ui/react';
import type { ForwardedRef } from 'react';
import { forwardRef, useState } from 'react';

type Option = {
  value: string;
  label: string;
};

type RadioProps = {
  error?: string;
  label: string;
  options: Option[];
  defaultValue?: string;
  onChange?: (value: string) => void;
  name?: string;
};

export const Radio = forwardRef(function Radio(
  { error, label, options, defaultValue, onChange, name }: RadioProps,
  ref: ForwardedRef<HTMLInputElement>
) {
  const [selectedValue, setSelectedValue] = useState(defaultValue);

  const handleChange = (value: string) => {
    setSelectedValue(value);
    onChange?.(value);
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
                type="radio"
                name={name}
                value={option.value}
                checked={selectedValue === option.value}
                onChange={() => handleChange(option.value)}
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
                type="radio"
                name={name}
                value={option.value}
                checked={selectedValue === option.value}
                onChange={() => handleChange(option.value)}
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
