import {
  Badge,
  Box,
  Button,
  Heading,
  HStack,
  Stack,
  Text,
} from '@chakra-ui/react';
import { Controller, FormProvider } from 'react-hook-form';
import {
  CheckboxGroup,
  DateRangePicker,
  DateSelector,
  PinInput,
  Radio,
  Select,
  SimpleForm,
  Switch,
  TextInput,
  Combobox,
} from '~/common/ui';
import { useAdvancedFormHandler } from './use-handler';

export default function AdvancedFormPage() {
  const {
    form,
    isLoading,
    handleSubmit,
    roleOptions,
    departmentOptions,
    regionOptions,
    tagOptions,
  } = useAdvancedFormHandler();

  return (
    <Box>
      <Stack gap={6}>
        <Box>
          <Heading size="lg">Advanced Form Demo</Heading>
          <Text color="gray.600" mt={2}>
            Playground page for all available form-fields.
          </Text>
        </Box>

        <FormProvider {...form}>
          <SimpleForm onSubmit={handleSubmit}>
            <TextInput
              {...form.register('fullName')}
              label="Full name"
              placeholder="Enter full name"
              error={form.formState.errors.fullName?.message}
            />

            <TextInput
              {...form.register('email')}
              type="email"
              label="Email"
              placeholder="user@example.com"
              error={form.formState.errors.email?.message}
            />

            <Select
              name="role"
              label="Primary role"
              options={roleOptions}
              placeholder="Select role"
            />

            <Controller
              name="status"
              control={form.control}
              render={({ field, fieldState }) => (
                <Radio
                  name={field.name}
                  label="Status"
                  options={[
                    { value: 'Active', label: 'Active' },
                    { value: 'Pending', label: 'Pending' },
                    { value: 'Inactive', label: 'Inactive' },
                  ]}
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="departments"
              control={form.control}
              render={({ field, fieldState }) => (
                <CheckboxGroup
                  name={field.name}
                  label="Departments"
                  options={departmentOptions}
                  selectedValues={field.value ?? []}
                  onValueChange={field.onChange}
                  error={fieldState.error?.message}
                />
              )}
            />

            <Combobox
              name="region"
              label="Region"
              options={regionOptions}
              placeholder="Search region"
            />

            <Controller
              name="tags"
              control={form.control}
              render={({ field, fieldState }) => (
                <CheckboxGroup
                  name={field.name}
                  label="Tags"
                  options={tagOptions}
                  selectedValues={field.value ?? []}
                  onValueChange={field.onChange}
                  error={fieldState.error?.message}
                />
              )}
            />

            <DateSelector name="datePreset" label="Date preset" />

            <DateRangePicker
              name="activePeriod"
              label="Active period"
              testId="active-period"
            />

            <Switch name="notifications" label="Enable notifications" />

            <PinInput
              name="otpCode"
              label="Verification code"
              length={6}
              align="start"
            />

            <HStack gap={3} wrap="wrap">
              <Badge colorPalette="blue">CheckboxGroup</Badge>
              <Badge colorPalette="green">Combobox</Badge>
              <Badge colorPalette="purple">Select</Badge>
              <Badge colorPalette="orange">DateRange</Badge>
              <Badge colorPalette="teal">PinInput</Badge>
            </HStack>

            <Button type="submit" colorScheme="blue" loading={isLoading}>
              Submit advanced form
            </Button>
          </SimpleForm>
        </FormProvider>
      </Stack>
    </Box>
  );
}
