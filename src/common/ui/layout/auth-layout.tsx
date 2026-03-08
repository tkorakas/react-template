import { Box, Container, Stack } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <Container maxW="md" py={12}>
      <Box borderWidth="1px" borderRadius="lg" boxShadow="lg" p={8} bg="white">
        <Stack gap={6}>
          <Outlet />
        </Stack>
      </Box>
    </Container>
  );
}
