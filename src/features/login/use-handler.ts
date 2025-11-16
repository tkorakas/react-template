import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '~/common/auth/use-auth';
import { MfaRequiredError } from '~/common/errors';
import { login } from '~/data-access/api';
import { loginSchema, type LoginFormData } from './schema';

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
    onSuccess: user => {
      setUser(user);
      navigate(from, { replace: true });
    },
    onError: error => {
      if (error instanceof MfaRequiredError) {
        navigate('/mfa');
        return;
      }
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
  };
}
