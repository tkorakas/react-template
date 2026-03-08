import {
  Box,
  Button,
  Flex,
  IconButton,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { getDateRangeFromPreset, type DatePreset } from './date-selector';

function parseISODate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1);
}

function formatISODate(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addDaysToDate(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function addMonthsToDate(date: Date, months: number): Date {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}

function startOfMonthDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonthDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function startOfWeekDate(date: Date, weekStartsOn: number): Date {
  const currentDay = date.getDay();
  const diff = (currentDay - weekStartsOn + 7) % 7;
  return addDaysToDate(date, -diff);
}

function endOfWeekDate(date: Date, weekStartsOn: number): Date {
  return addDaysToDate(startOfWeekDate(date, weekStartsOn), 6);
}

function isBeforeDate(a: Date, b: Date): boolean {
  return a.getTime() < b.getTime();
}

function isSameDayDate(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isSameMonthDate(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function isWithinIntervalDate(
  date: Date,
  interval: { start: Date; end: Date }
): boolean {
  const time = date.getTime();
  return time >= interval.start.getTime() && time <= interval.end.getTime();
}

export type DateRangeValue = {
  startDate?: string;
  endDate?: string;
};

type PresetOption = {
  value: DatePreset;
  label: string;
};

type DateRangeCalendarProps = {
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
  onBlur: () => void;
  disabled: boolean;
  presets?: PresetOption[];
};

const WEEK_STARTS_ON = 1;
export function DateRangeCalendar({
  value,
  onChange,
  onBlur,
  disabled,
  presets = [],
}: DateRangeCalendarProps) {
  const { t, i18n } = useTranslation('common');

  const [viewDate, setViewDate] = useState(() => {
    if (value.startDate) return parseISODate(value.startDate);
    if (value.endDate) return parseISODate(value.endDate);
    return new Date();
  });

  const normalizedStart = value.startDate ?? value.endDate;
  const normalizedEnd = value.endDate ?? value.startDate;
  const startDate = normalizedStart ? parseISODate(normalizedStart) : undefined;
  const endDate = normalizedEnd ? parseISODate(normalizedEnd) : undefined;
  const hasRange = !!startDate && !!endDate;
  const rangeIsSingleDay = hasRange && isSameDayDate(startDate, endDate);

  const monthLabel = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(i18n.language, {
      month: 'long',
      year: 'numeric',
    });
    return formatter.format(viewDate);
  }, [i18n.language, viewDate]);

  const fullDateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(i18n.language, {
        dateStyle: 'full',
      }),
    [i18n.language]
  );

  const weekdayLabels = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(i18n.language, {
      weekday: 'short',
    });
    const start = startOfWeekDate(new Date(), WEEK_STARTS_ON);
    return Array.from({ length: 7 }, (_, index) =>
      formatter.format(addDaysToDate(start, index))
    );
  }, [i18n.language]);

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonthDate(viewDate);
    const monthEnd = endOfMonthDate(viewDate);
    const calendarStart = startOfWeekDate(monthStart, WEEK_STARTS_ON);
    const calendarEnd = endOfWeekDate(monthEnd, WEEK_STARTS_ON);

    const days: Date[] = [];
    let current = calendarStart;

    while (current <= calendarEnd) {
      days.push(current);
      current = addDaysToDate(current, 1);
    }

    return days;
  }, [viewDate]);

  const isPresetSelected = (preset: DatePreset) => {
    const range = getDateRangeFromPreset(preset);
    if (!range.firstSeen && !range.lastSeen) {
      return !value.startDate && !value.endDate;
    }
    return (
      range.firstSeen === value.startDate && range.lastSeen === value.endDate
    );
  };

  const handleMonthChange = (direction: 'prev' | 'next') => {
    setViewDate(current =>
      addMonthsToDate(current, direction === 'prev' ? -1 : 1)
    );
  };

  const handlePresetSelect = (preset: DatePreset) => {
    const range = getDateRangeFromPreset(preset);
    onChange({
      startDate: range.firstSeen,
      endDate: range.lastSeen,
    });
    onBlur();
  };

  const handleSelect = (date: Date) => {
    const selectedDate = formatISODate(date);

    if (!value.startDate || !value.endDate) {
      onChange({ startDate: selectedDate, endDate: selectedDate });
      onBlur();
      return;
    }

    if (!rangeIsSingleDay) {
      onChange({ startDate: selectedDate, endDate: selectedDate });
      onBlur();
      return;
    }

    const currentStart = parseISODate(value.startDate);
    if (isBeforeDate(date, currentStart)) {
      onChange({
        startDate: selectedDate,
        endDate: value.startDate,
      });
      onBlur();
      return;
    }

    onChange({ startDate: value.startDate, endDate: selectedDate });
    onBlur();
  };

  return (
    <Flex gap={3} flexWrap={{ base: 'wrap', md: 'nowrap' }}>
      {presets.length > 0 && (
        <>
          <Box px={3} py={2} minW={{ base: '100%', md: 180 }}>
            <Flex direction="column" gap={1}>
              {presets.map(preset => {
                const isSelected = isPresetSelected(preset.value);
                return (
                  <Button
                    key={preset.value}
                    variant={isSelected ? 'subtle' : 'ghost'}
                    size="sm"
                    justifyContent="flex-start"
                    onClick={() => handlePresetSelect(preset.value)}
                    disabled={disabled}
                  >
                    {preset.label}
                  </Button>
                );
              })}
            </Flex>
          </Box>
          <Box
            w="1px"
            bg="gray.200"
            alignSelf="stretch"
            display={{ base: 'none', md: 'block' }}
          />
        </>
      )}
      <Box px={3} py={2} flex="1">
        <Flex align="center" justify="space-between" mb={2}>
          <IconButton
            aria-label={t('datePicker.previousMonth')}
            variant="ghost"
            size="sm"
            onClick={() => handleMonthChange('prev')}
            disabled={disabled}
          >
            <LuChevronLeft />
          </IconButton>
          <Text fontWeight="semibold">{monthLabel}</Text>
          <IconButton
            aria-label={t('datePicker.nextMonth')}
            variant="ghost"
            size="sm"
            onClick={() => handleMonthChange('next')}
            disabled={disabled}
          >
            <LuChevronRight />
          </IconButton>
        </Flex>

        <SimpleGrid columns={7} gap={1} mb={1}>
          {weekdayLabels.map((labelText, index) => (
            <Text key={index} textAlign="center" fontSize="xs" color="gray.500">
              {labelText}
            </Text>
          ))}
        </SimpleGrid>

        <SimpleGrid columns={7} gap={1}>
          {calendarDays.map(date => {
            const isOutside = !isSameMonthDate(date, viewDate);
            const isStart = !!startDate && isSameDayDate(date, startDate);
            const isEnd = !!endDate && isSameDayDate(date, endDate);
            const isSelected = isStart || isEnd;
            const isInRange =
              startDate &&
              endDate &&
              !rangeIsSingleDay &&
              isWithinIntervalDate(date, {
                start: startDate,
                end: endDate,
              }) &&
              !isSelected;
            const isRangeEdge = isStart || isEnd;
            const dateLabel = fullDateFormatter.format(date);

            return (
              <Button
                key={date.toISOString()}
                variant="ghost"
                size="sm"
                h={8}
                w={8}
                p={0}
                borderRadius="full"
                onClick={() => handleSelect(date)}
                disabled={disabled || isOutside}
                bg={
                  isSelected
                    ? 'gray.700'
                    : isInRange
                      ? 'gray.100'
                      : 'transparent'
                }
                color={
                  isSelected ? 'white' : isOutside ? 'gray.400' : 'inherit'
                }
                _hover={
                  isOutside || disabled
                    ? undefined
                    : {
                        bg: isRangeEdge
                          ? 'gray.700'
                          : isInRange
                            ? 'gray.200'
                            : 'gray.100',
                      }
                }
                aria-label={t('datePicker.dayLabel', {
                  date: dateLabel,
                })}
              >
                {date.getDate()}
              </Button>
            );
          })}
        </SimpleGrid>
      </Box>
    </Flex>
  );
}
