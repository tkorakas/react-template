# Data and Feedback Components

## Data components

`DataTable` and `Pagination` are the foundation for list pages.

For table-heavy pages, use shared table helpers from `~/common/ui/table`:

- `useTableState` for URL query sync (`filters`, `page`, `limit`, `sorting`, and row selection).
- `FiltersPanel` for compact, popover-based filter controls.
- `TableChipFilter` for quick toggle filters (status/date presets).
- `TableActionBar` for bulk actions on selected rows.

Typical handler responsibilities:

- Define columns in a dedicated `<feature>.column.ts` hook.
- Maintain sorting/filter/page state with `useTableState`.
- Query paginated data from `data-access`.
- Derive client-side filtered rows when filters are not server-driven.

Example columns pattern:

```ts
const columns: ColumnDef<TeamMember>[] = useMemo(
  () => [
    { accessorKey: 'name', header: t('columns.name') },
    { accessorKey: 'role', header: t('columns.role') },
    { accessorKey: 'status', header: t('columns.status') },
  ],
  [t]
);
```

## Feedback components

- `Toaster` and `toaster` for success/error notifications.
- `DialogProvider` + `useDialog` for modal confirmation flows.
- `Drawer` for embedded create/edit workflows.

Keep trigger and display wiring in page files; keep side effects and mutation flows in handlers.
