import { Field } from '@chakra-ui/react';
import { useEffect } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { DateRangeSelector, type DateRangeValue } from './date-range-selector';

type DateRangePickerProps = {
  name: string;
  label?: string;
  testId?: string;
  disabled?: boolean;
};

export function DateRangePicker({
  name,
  label,
  testId,
  disabled = false,
}: DateRangePickerProps) {
  const { control, setValue } = useFormContext();
  const watchedValue = useWatch({ control, name }) as
    | DateRangeValue
    | undefined;
  const watchedStartDate = watchedValue?.startDate;
  const watchedEndDate = watchedValue?.endDate;

  useEffect(() => {
    if (watchedStartDate && !watchedEndDate) {
      setValue(
        name,
        { startDate: watchedStartDate, endDate: watchedStartDate },
        { shouldDirty: false, shouldValidate: false }
      );
    } else if (watchedEndDate && !watchedStartDate) {
      setValue(
        name,
        { startDate: watchedEndDate, endDate: watchedEndDate },
        { shouldDirty: false, shouldValidate: false }
      );
    }
  }, [name, setValue, watchedStartDate, watchedEndDate]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        return (
          <Field.Root invalid={!!fieldState.error} data-testid={testId}>
            {label && <Field.Label>{label}</Field.Label>}
            <DateRangeSelector
              value={(field.value ?? {}) as DateRangeValue}
              onChange={field.onChange}
              onBlur={field.onBlur}
              disabled={disabled}
            />
            <Field.ErrorText>{fieldState.error?.message}</Field.ErrorText>
          </Field.Root>
        );
      }}
    />
  );
}

export type { DateRangeValue };
