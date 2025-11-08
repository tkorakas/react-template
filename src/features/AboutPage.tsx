import { Box, VStack, Heading, Text, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

function AboutPage() {
  return (
    <Box p={8}>
      <VStack gap={6} align="start">
        <Heading>About This Template</Heading>

        <Text>
          This is a modern React template built with the following technologies:
        </Text>

        <VStack gap={3} align="start">
          <Text>
            <strong>Vite:</strong> Fast build tool for modern web development
          </Text>
          <Text>
            <strong>React 18:</strong> Latest version of React with TypeScript
          </Text>
          <Text>
            <strong>Chakra UI:</strong> Modern component library for React
          </Text>
          <Text>
            <strong>React Router:</strong> Declarative routing for React
          </Text>
          <Text>
            <strong>TanStack Query:</strong> Powerful data fetching and caching
          </Text>
          <Text>
            <strong>React Hook Form:</strong> Performant forms with minimal
            re-renders
          </Text>
          <Text>
            <strong>Zod:</strong> TypeScript-first schema validation
          </Text>
          <Text>
            <strong>Ky:</strong> Modern HTTP client based on fetch
          </Text>
        </VStack>

        <Link to="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </VStack>
    </Box>
  );
}

export default AboutPage;
