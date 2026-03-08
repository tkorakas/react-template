import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { USER_QUERY_KEY } from '~/common/auth/use-auth';
import { queryClient } from '~/common/query-client';
import { verifyMfa } from '~/data-access/auth/auth.api';
import { mfaSchema, type MfaFormData } from './mfa.schema';

export function useMfaHandler() {
  const { t } = useTranslation('mfa');
  const navigate = useNavigate();

  const form = useForm<MfaFormData>({
    resolver: zodResolver(mfaSchema(t)),
  });

  const mutation = useMutation({
    mutationFn: (data: MfaFormData) => verifyMfa(data.otp),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
      navigate('/');
    },
  });

  return {
    form,
    isLoading: mutation.isPending,
    handleSubmit: form.handleSubmit(data => mutation.mutate(data)),
    error: mutation.error,
  };
}
