import {
  Field,
  Portal,
  Select as ChakraSelect,
  createListCollection,
} from '@chakra-ui/react';
import { useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DATE_PRESETS, type DatePreset } from './date-presets.utils';

type DateSelectorProps = {
  name: string;
  label?: string;
  testId?: string;
};

export function DateSelector({ name, label, testId }: DateSelectorProps) {
  const { t } = useTranslation('common');
  const { control } = useFormContext();

  const options = useMemo(
    () => [
      { value: DATE_PRESETS.allTime, label: t('filters.datePresets.allTime') },
      {
        value: DATE_PRESETS.lastWeek,
        label: t('filters.datePresets.lastWeek'),
      },
      {
        value: DATE_PRESETS.last30Days,
        label: t('filters.datePresets.last30Days'),
      },
      {
        value: DATE_PRESETS.last3Months,
        label: t('filters.datePresets.last3Months'),
      },
      {
        value: DATE_PRESETS.last6Months,
        label: t('filters.datePresets.last6Months'),
      },
      {
        value: DATE_PRESETS.last12Months,
        label: t('filters.datePresets.last12Months'),
      },
    ],
    [t]
  );

  const collection = createListCollection({ items: options });

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field.Root invalid={!!fieldState.error}>
          {label && <Field.Label>{label}</Field.Label>}
          <ChakraSelect.Root
            collection={collection}
            value={
              field.value ? [field.value as DatePreset] : [DATE_PRESETS.allTime]
            }
            onValueChange={e => {
              const value = e.value[0];
              field.onChange(value === DATE_PRESETS.allTime ? '' : value);
            }}
            data-testid={testId}
          >
            <ChakraSelect.HiddenSelect />
            <ChakraSelect.Control>
              <ChakraSelect.Trigger>
                <ChakraSelect.ValueText />
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
                      {option.label}
                      <ChakraSelect.ItemIndicator />
                    </ChakraSelect.Item>
                  ))}
                </ChakraSelect.Content>
              </ChakraSelect.Positioner>
            </Portal>
          </ChakraSelect.Root>
          <Field.ErrorText>{fieldState.error?.message}</Field.ErrorText>
        </Field.Root>
      )}
    />
  );
}
