import { Stack } from '@chakra-ui/react';
import type { FormEvent, PropsWithChildren } from 'react';

export function SimpleForm({
  children,
  onSubmit,
}: PropsWithChildren<{
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}>) {
  return (
    <form onSubmit={onSubmit}>
      <Stack gap={5}>{children}</Stack>
    </form>
  );
}
