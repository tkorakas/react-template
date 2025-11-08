import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import type { User } from '~/common/auth/types';
import { useAuth } from '~/common/auth/use-auth';
import { login } from '~/data-access/api';
import { loginSchema, type LoginFormData } from './login.schema';

export function useLoginHandler() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: response => {
      const user: User = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
      };

      // Update user state in cache
      setUser(user);

      // Navigate to the page user was trying to access
      navigate(from, { replace: true });
    },
    onError: error => {
      // eslint-disable-next-line no-console
      console.error('Login failed:', error);

      // Set form error
      form.setError('root', {
        type: 'manual',
        message: 'Invalid email or password. Please try again.',
      });
    },
  });

  const handleSubmit = form.handleSubmit(data => {
    loginMutation.mutate(data);
  });

  return {
    form,
    handleSubmit,
    isLoading: loginMutation.isPending,
    error: form.formState.errors.root?.message,
  };
}
