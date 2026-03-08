import {
  Badge,
  Box,
  Button,
  Heading,
  HStack,
  Stack,
  Text,
} from '@chakra-ui/react';
import { FormProvider } from 'react-hook-form';
import {
  DateRangePicker,
  DateSelector,
  MultiCheckbox,
  PinInput,
  RadioGroup,
  Select,
  SimpleForm,
  Switch,
  TextInput,
  Combobox,
} from '~/common/ui';
import { useAdvancedFormHandler } from './advanced-form.handler';

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

            <RadioGroup
              name="status"
              label="Status"
              options={[
                { value: 'Active', label: 'Active' },
                { value: 'Pending', label: 'Pending' },
                { value: 'Inactive', label: 'Inactive' },
              ]}
            />

            <MultiCheckbox
              name="departments"
              label="Departments"
              options={departmentOptions}
            />

            <Combobox
              name="region"
              label="Region"
              options={regionOptions}
              placeholder="Search region"
            />

            <MultiCheckbox name="tags" label="Tags" options={tagOptions} />

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
              <Badge colorPalette="blue">MultiCheckbox</Badge>
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
