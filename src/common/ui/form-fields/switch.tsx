import { Field, Switch as ChakraSwitch } from '@chakra-ui/react';
import { Controller, useFormContext } from 'react-hook-form';

type SwitchProps = {
  name: string;
  label: string;
  testId?: string;
};

export function Switch({ name, label, testId }: SwitchProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field.Root invalid={!!fieldState.error}>
          <ChakraSwitch.Root
            checked={field.value}
            onCheckedChange={e => field.onChange(!!e.checked)}
            data-testid={testId}
          >
            <ChakraSwitch.HiddenInput />
            <ChakraSwitch.Label>{label}</ChakraSwitch.Label>
            <ChakraSwitch.Control>
              <ChakraSwitch.Thumb />
            </ChakraSwitch.Control>
          </ChakraSwitch.Root>
          <Field.ErrorText>{fieldState.error?.message}</Field.ErrorText>
        </Field.Root>
      )}
    />
  );
}
