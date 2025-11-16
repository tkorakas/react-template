import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { USER_QUERY_KEY } from '~/common/auth/use-auth';
import { queryClient } from '~/common/query-client';
import { register } from '~/data-access/api';
import { toaster } from '~/ui';
import { registerSchema, type RegisterFormData } from './schema';

export function useRegisterHandler() {
  const navigate = useNavigate();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
      navigate('/');
    },
    onError: async error => {
      //   if (error instanceof HTTPError) {
      //     const handled = await handleApiFieldErrors(error, form.setError);
      //     if (handled) {
      //       return;
      //     }
      //   }

      toaster.create({
        title: 'Registration Failed',
        description: 'An unexpected error occurred. Please try again.',
        type: 'error',
        duration: 5000,
      });
    },
  });

  return {
    form,
    isLoading: mutation.isPending,
    handleSubmit: form.handleSubmit(data =>
      mutation.mutate(data as RegisterFormData)
    ),
  };
}
