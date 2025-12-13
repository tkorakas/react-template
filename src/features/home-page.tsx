import { Box, Heading, Text, VStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

import { useAuth } from '~/common/auth';
import { Button } from '~/ui';

export default function HomePage() {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Box p={8}>
      <VStack gap={6} align="start">
        <Heading>Welcome to React Template</Heading>
        <Link to="/about">
          <Button variant="outline">Go to About Page</Button>
        </Link>
        <Button onClick={handleLogout} colorScheme="red">
          Logout
        </Button>
        <Text>This template includes:</Text>
        <ul>
          <li>⚡ Vite + React + TypeScript</li>
          <li>🎨 Chakra UI for styling</li>
          <li>🧭 React Router for navigation</li>
          <li>🔍 TanStack Query for data fetching</li>
          <li>📝 React Hook Form with Zod validation</li>
          <li>🌐 Ky for HTTP requests</li>
        </ul>
      </VStack>
    </Box>
  );
}
