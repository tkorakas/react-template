import { Button, Wrap, type WrapProps } from '@chakra-ui/react';
import type { ReactNode } from 'react';

export type TableChipFilterOption = {
  value: string;
  label: string;
};

type TableChipFilterProps = {
  value?: string;
  options: TableChipFilterOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
  testId?: string;
  justify?: WrapProps['justify'];
  children?: ReactNode;
};

export function TableChipFilter({
  value,
  options,
  onChange,
  disabled = false,
  testId,
  justify = 'flex-end',
  children,
}: TableChipFilterProps) {
  return (
    <Wrap gap={2} justify={justify} data-testid={testId}>
      {options.map(option => {
        const isSelected = option.value === value;

        return (
          <Button
            key={option.value}
            variant="outline"
            size="2xs"
            colorPalette="gray"
            borderColor={isSelected ? 'blue.500' : 'gray.200'}
            borderWidth={isSelected ? '2px' : '1px'}
            borderRadius="full"
            px={3}
            py={1.5}
            _hover={{
              borderColor: isSelected ? 'blue.500' : 'gray.300',
              borderWidth: isSelected ? '2px' : '1px',
            }}
            _focusVisible={{
              borderColor: isSelected ? 'blue.500' : 'blue.400',
              borderWidth: isSelected ? '2px' : '1px',
            }}
            onClick={() => {
              if (!disabled) {
                onChange(option.value);
              }
            }}
            disabled={disabled}
          >
            {option.label}
          </Button>
        );
      })}
      {children}
    </Wrap>
  );
}
