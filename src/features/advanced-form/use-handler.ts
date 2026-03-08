import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toaster } from '~/common/ui';
import { advancedFormSchema, type AdvancedFormData } from './schema';

const roleOptions = [
  { label: 'Admin', value: 'admin' },
  { label: 'Developer', value: 'developer' },
  { label: 'Designer', value: 'designer' },
  { label: 'Support', value: 'support' },
];

const departmentOptions = [
  { label: 'Engineering', value: 'engineering' },
  { label: 'Product', value: 'product' },
  { label: 'Operations', value: 'operations' },
  { label: 'Marketing', value: 'marketing' },
];

const regionOptions = [
  { label: 'Europe', value: 'eu' },
  { label: 'North America', value: 'na' },
  { label: 'Asia Pacific', value: 'apac' },
];

const tagOptions = [
  { label: 'React', value: 'react' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Chakra UI', value: 'chakra' },
  { label: 'Testing', value: 'testing' },
  { label: 'DevOps', value: 'devops' },
];

export function useAdvancedFormHandler() {
  const form = useForm<AdvancedFormData>({
    resolver: zodResolver(advancedFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      role: '',
      status: 'Active',
      tags: [],
      departments: [],
      region: '',
      datePreset: '',
      activePeriod: {
        startDate: undefined,
        endDate: undefined,
      },
      notifications: true,
      otpCode: '',
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: AdvancedFormData) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return data;
    },
    onSuccess: data => {
      toaster.create({
        type: 'success',
        title: 'Form submitted',
        description: `Saved ${data.fullName} with ${data.tags.length} tags.`,
      });
    },
  });

  return {
    form,
    roleOptions,
    departmentOptions,
    regionOptions,
    tagOptions,
    isLoading: mutation.isPending,
    handleSubmit: form.handleSubmit(data => mutation.mutate(data)),
  };
}
