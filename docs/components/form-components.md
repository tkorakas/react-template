# Form Components

## Form wiring model

This repository uses two patterns:

- `TextInput` with direct `register` props from React Hook Form.
- Most other fields (`Select`, `RadioGroup`, `Combobox`, `DateRangePicker`, etc.) with `Controller` and `useFormContext` inside the shared component.

Because of this, complex fields should be rendered under:

```tsx
<FormProvider {...form}>
  <SimpleForm onSubmit={handleSubmit}>{/* fields */}</SimpleForm>
</FormProvider>
```

## Common field inventory

- `TextInput`
- `Checkbox`
- `MultiCheckbox`
- `RadioGroup`
- `Select`
- `Combobox`
- `AsyncMultiCombobox`
- `Switch`
- `PinInput`
- `DateSelector`
- `DateRangePicker`
- `DateRangeSelector`

## Validation strategy

- Field and cross-field rules live in feature schema files (`*.schema.ts`).
- Error messages are read from i18n keys when applicable.
- API field errors can be mapped back to form fields in handlers.
