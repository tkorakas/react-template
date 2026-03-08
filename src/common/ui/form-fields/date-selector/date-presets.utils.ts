export const DATE_PRESETS = {
  allTime: 'allTime',
  lastWeek: 'lastWeek',
  last30Days: 'last30Days',
  last3Months: 'last3Months',
  last6Months: 'last6Months',
  last12Months: 'last12Months',
} as const;

export type DatePreset = (typeof DATE_PRESETS)[keyof typeof DATE_PRESETS];

export type DateRange = {
  firstSeen?: string;
  lastSeen?: string;
};

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function getDateRangeFromPreset(preset?: string): DateRange {
  if (!preset || preset === DATE_PRESETS.allTime) {
    return {};
  }

  const today = new Date();
  const lastSeen = formatDate(today);
  let firstSeen: string;

  switch (preset) {
    case DATE_PRESETS.lastWeek: {
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 7);
      firstSeen = formatDate(weekAgo);
      break;
    }
    case DATE_PRESETS.last30Days: {
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 30);
      firstSeen = formatDate(thirtyDaysAgo);
      break;
    }
    case DATE_PRESETS.last3Months: {
      const threeMonthsAgo = new Date(today);
      threeMonthsAgo.setMonth(today.getMonth() - 3);
      firstSeen = formatDate(threeMonthsAgo);
      break;
    }
    case DATE_PRESETS.last6Months: {
      const sixMonthsAgo = new Date(today);
      sixMonthsAgo.setMonth(today.getMonth() - 6);
      firstSeen = formatDate(sixMonthsAgo);
      break;
    }
    case DATE_PRESETS.last12Months: {
      const twelveMonthsAgo = new Date(today);
      twelveMonthsAgo.setFullYear(today.getFullYear() - 1);
      firstSeen = formatDate(twelveMonthsAgo);
      break;
    }
    default:
      return {};
  }

  return { firstSeen, lastSeen };
}
