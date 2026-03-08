# Data and Feedback Components

## Data components

`DataTable` and `Pagination` are the foundation for list pages.

Typical handler responsibilities:

- Declare `ColumnDef[]` with translated headers.
- Maintain sorting and filter state.
- Query paginated data from `data-access`.
- Derive client-side filtered rows.

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
