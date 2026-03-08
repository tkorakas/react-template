export type Filters = Record<string, unknown>;

export function countActiveFilters(filters: Filters): number {
  return Object.entries(filters).filter(([_, value]) => Boolean(value)).length;
}

export function hasActiveFilters(filters: Filters): boolean {
  return countActiveFilters(filters) > 0;
}

function sortedStringify(obj: Filters): string {
  const sortedKeys = Object.keys(obj).sort();
  const sortedObj: Filters = {};
  for (const key of sortedKeys) {
    sortedObj[key] = obj[key];
  }
  return JSON.stringify(sortedObj);
}

export function hasFiltersChanged(
  currentFilters: Filters,
  initialFilters: Filters
): boolean {
  return sortedStringify(currentFilters) !== sortedStringify(initialFilters);
}
