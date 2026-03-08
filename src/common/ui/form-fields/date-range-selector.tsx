import {
  Button,
  Input,
  InputGroup,
  Popover,
  Portal,
  type WrapProps,
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuChevronDown } from 'react-icons/lu';
import { TableChipFilter } from '../table/table-chip-filter';
import { DateRangeCalendar, type DateRangeValue } from './date-range-calendar';
import {
  DATE_PRESETS,
  getDateRangeFromPreset,
  type DatePreset,
} from './date-selector';

type DateRangeSelectorProps = {
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
  onBlur?: () => void;
  disabled?: boolean;
  variant?: 'input' | 'chips';
  chipsJustify?: WrapProps['justify'];
  testId?: string;
};

type DatePresetOption = {
  value: DatePreset;
  label: string;
};

const INPUT_PRESET_VALUES: DatePreset[] = [
  DATE_PRESETS.allTime,
  DATE_PRESETS.lastWeek,
  DATE_PRESETS.last30Days,
  DATE_PRESETS.last3Months,
  DATE_PRESETS.last6Months,
  DATE_PRESETS.last12Months,
];

const CHIP_PRESET_VALUES: DatePreset[] = [
  DATE_PRESETS.allTime,
  DATE_PRESETS.lastWeek,
  DATE_PRESETS.last30Days,
  DATE_PRESETS.last3Months,
];

function normalizeDateRange(value: DateRangeValue): DateRangeValue {
  if (value.startDate && !value.endDate) {
    return { startDate: value.startDate, endDate: value.startDate };
  }

  if (value.endDate && !value.startDate) {
    return { startDate: value.endDate, endDate: value.endDate };
  }

  return value;
}

function parseISODate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1);
}

function getPresetLabel(
  t: (key: string) => string,
  preset: DatePreset
): string {
  switch (preset) {
    case DATE_PRESETS.allTime:
      return t('filters.datePresets.allTime');
    case DATE_PRESETS.lastWeek:
      return t('filters.datePresets.lastWeek');
    case DATE_PRESETS.last30Days:
      return t('filters.datePresets.last30Days');
    case DATE_PRESETS.last3Months:
      return t('filters.datePresets.last3Months');
    case DATE_PRESETS.last6Months:
      return t('filters.datePresets.last6Months');
    case DATE_PRESETS.last12Months:
      return t('filters.datePresets.last12Months');
  }
}

function getPresetLabels(
  t: (key: string) => string,
  presetValues: DatePreset[]
): DatePresetOption[] {
  return presetValues.map(value => ({
    value,
    label: getPresetLabel(t, value),
  }));
}

function getDisplayValue(
  value: DateRangeValue,
  presets: DatePresetOption[],
  t: (key: string, values?: Record<string, string>) => string,
  formatter: Intl.DateTimeFormat,
  variant: 'input' | 'chips'
): string {
  const normalizedStart = value.startDate ?? value.endDate;
  const normalizedEnd = value.endDate ?? value.startDate;

  const selectedPreset = presets.find(preset => {
    const range = getDateRangeFromPreset(preset.value);

    if (!range.firstSeen && !range.lastSeen) {
      return !normalizedStart && !normalizedEnd;
    }

    return (
      range.firstSeen === normalizedStart && range.lastSeen === normalizedEnd
    );
  });

  if (selectedPreset) {
    return selectedPreset.label;
  }

  if (normalizedStart && normalizedEnd) {
    if (variant === 'chips' && normalizedStart === normalizedEnd) {
      return formatter.format(parseISODate(normalizedStart));
    }

    return t('datePicker.rangeValue', {
      start: formatter.format(parseISODate(normalizedStart)),
      end: formatter.format(parseISODate(normalizedEnd)),
    });
  }

  return '';
}

function getSelectedPreset(
  value: DateRangeValue,
  presetValues: DatePreset[]
): DatePreset | undefined {
  const normalizedStart = value.startDate ?? value.endDate;
  const normalizedEnd = value.endDate ?? value.startDate;

  return presetValues.find(preset => {
    const range = getDateRangeFromPreset(preset);

    if (!range.firstSeen && !range.lastSeen) {
      return !normalizedStart && !normalizedEnd;
    }

    return (
      range.firstSeen === normalizedStart && range.lastSeen === normalizedEnd
    );
  });
}

export function DateRangeSelector({
  value,
  onChange,
  onBlur,
  disabled = false,
  variant = 'input',
  chipsJustify = 'flex-end',
  testId,
}: DateRangeSelectorProps) {
  const { t, i18n } = useTranslation('common');
  const [open, setOpen] = useState(false);
  const normalizedValue = normalizeDateRange(value);
  const presetValues =
    variant === 'chips' ? CHIP_PRESET_VALUES : INPUT_PRESET_VALUES;

  const presetLabels = useMemo(
    () => getPresetLabels(t, presetValues),
    [presetValues, t]
  );

  const rangeDateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(i18n.language, {
        dateStyle: 'medium',
      }),
    [i18n.language]
  );

  const displayValue = getDisplayValue(
    normalizedValue,
    presetLabels,
    t,
    rangeDateFormatter,
    variant
  );

  const selectedPreset = getSelectedPreset(normalizedValue, presetValues);
  const isCustomSelected = !selectedPreset;
  const selectedPresetValue = selectedPreset ?? '';
  const customLabel = isCustomSelected
    ? displayValue || t('filters.datePresets.custom')
    : t('filters.datePresets.custom');

  const handleChange = (nextValue: DateRangeValue) => {
    onChange(normalizeDateRange(nextValue));
  };

  const handlePresetSelect = (preset: DatePreset) => {
    const range = getDateRangeFromPreset(preset);
    handleChange({
      startDate: range.firstSeen,
      endDate: range.lastSeen,
    });
    onBlur?.();
    setOpen(false);
  };

  if (variant === 'chips') {
    return (
      <Popover.Root
        lazyMount
        unmountOnExit
        open={disabled ? false : open}
        onOpenChange={e => {
          if (!disabled) {
            setOpen(e.open);
          }
        }}
      >
        <TableChipFilter
          value={selectedPresetValue}
          options={presetLabels}
          onChange={value => handlePresetSelect(value as DatePreset)}
          disabled={disabled}
          justify={chipsJustify}
          testId={testId}
        >
          <Popover.Trigger asChild>
            <Button variant="outline" size="2xs" disabled={disabled}>
              {customLabel}
            </Button>
          </Popover.Trigger>
        </TableChipFilter>
        <Portal>
          <Popover.Positioner>
            <Popover.Content w={{ base: '100%', md: 'auto' }} maxW="420px">
              <Popover.Body p={3}>
                <DateRangeCalendar
                  value={normalizedValue}
                  onChange={handleChange}
                  onBlur={() => {
                    onBlur?.();
                    const isSingleDaySelectionBeforeClick =
                      !!normalizedValue.startDate &&
                      !!normalizedValue.endDate &&
                      normalizedValue.startDate === normalizedValue.endDate;

                    if (isSingleDaySelectionBeforeClick) {
                      setOpen(false);
                    }
                  }}
                  disabled={disabled}
                />
              </Popover.Body>
            </Popover.Content>
          </Popover.Positioner>
        </Portal>
      </Popover.Root>
    );
  }

  return (
    <Popover.Root
      lazyMount
      unmountOnExit
      open={open}
      onOpenChange={e => setOpen(e.open)}
    >
      <Popover.Trigger asChild>
        <InputGroup
          endElement={<LuChevronDown />}
          w="full"
          cursor={disabled ? 'not-allowed' : 'pointer'}
          data-testid={testId}
        >
          <Input
            readOnly
            value={displayValue}
            placeholder={t('datePicker.placeholder')}
            disabled={disabled}
            cursor={disabled ? 'not-allowed' : 'pointer'}
            onClick={() => !disabled && setOpen(true)}
          />
        </InputGroup>
      </Popover.Trigger>

      <Portal>
        <Popover.Positioner>
          <Popover.Content w={{ base: '100%', md: 'auto' }} maxW="720px">
            <Popover.Body p={3}>
              <DateRangeCalendar
                value={normalizedValue}
                onChange={handleChange}
                onBlur={onBlur ?? (() => undefined)}
                disabled={disabled}
                presets={presetLabels}
              />
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}

export type { DateRangeValue };
