import { Box, Heading, Text, VStack } from '@chakra-ui/react';

export default function HomePage() {
  return (
    <Box>
      <VStack gap={6} align="start">
        <Heading>Welcome to React Template</Heading>
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
