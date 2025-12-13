import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { createTeamMember } from '~/data-access/api';
import { createTeamMemberSchema, type CreateTeamMemberInput } from './schema';

export function useCreateTeamMemberHandler() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<CreateTeamMemberInput>({
    resolver: zodResolver(createTeamMemberSchema),
    defaultValues: {
      name: '',
      role: '',
      status: 'Active',
    },
  });

  const mutation = useMutation({
    mutationFn: createTeamMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
      navigate('/team-members');
    },
  });

  const handleClose = () => {
    navigate('/team-members');
  };

  return {
    form,
    isLoading: mutation.isPending,
    handleSubmit: form.handleSubmit(data => mutation.mutate(data)),
    handleClose,
    error: mutation.error,
  };
}
