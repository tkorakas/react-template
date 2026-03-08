import { Field, PinInput as ChakraPinInput } from '@chakra-ui/react';
import { Controller, useFormContext } from 'react-hook-form';

type PinInputProps = {
  name: string;
  label?: string;
  length?: number;
  disabled?: boolean;
  testId?: string;
  align?: 'start' | 'center';
};

export function PinInput({
  name,
  label,
  length = 6,
  disabled,
  testId,
  align = 'center',
}: PinInputProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];
  const justifyContent = align === 'start' ? 'flex-start' : 'center';
  const alignItems = align === 'start' ? 'flex-start' : 'center';

  const toPinArray = (value: unknown): string[] => {
    if (Array.isArray(value)) {
      return value.map(item => String(item)).slice(0, length);
    }

    if (typeof value === 'string') {
      return value.slice(0, length).split('');
    }

    return [];
  };

  return (
    <Field.Root invalid={!!error} alignItems={alignItems}>
      {label && <Field.Label>{label}</Field.Label>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <ChakraPinInput.Root
            value={toPinArray(field.value)}
            onValueChange={e => field.onChange(e.value.join(''))}
            disabled={disabled}
            otp
            size="lg"
            data-testid={testId}
            w="full"
          >
            <ChakraPinInput.HiddenInput />
            <ChakraPinInput.Control
              justifyContent={justifyContent}
              gap="2"
              display="flex"
            >
              {Array.from({ length }).map((_, index) => (
                <ChakraPinInput.Input key={index} index={index} />
              ))}
            </ChakraPinInput.Control>
          </ChakraPinInput.Root>
        )}
      />
      <Field.ErrorText>{error?.message?.toString()}</Field.ErrorText>
    </Field.Root>
  );
}
