import { Box, Heading, List, Text, VStack } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

export default function HomePage() {
  return (
    <Box>
      <VStack gap={8} align="start">
        <VStack gap={3} align="start">
          <Heading>React Template</Heading>
          <Text color="gray.600" maxW="4xl">
            A practical starter focused on authentication, data access patterns,
            reusable UI primitives, and feature-based organization.
          </Text>
        </VStack>

        <VStack gap={3} align="start">
          <Heading size="md">What this repo uses</Heading>
          <List.Root as="ul" gap={1} ps={5}>
            <List.Item>Vite + React + TypeScript</List.Item>
            <List.Item>Chakra UI v3 component system</List.Item>
            <List.Item>React Router for protected/public routes</List.Item>
            <List.Item>TanStack Query for server state</List.Item>
            <List.Item>React Hook Form + Zod for form validation</List.Item>
            <List.Item>Ky as the HTTP client</List.Item>
          </List.Root>
        </VStack>

        <VStack gap={3} align="start">
          <Heading size="md">Project structure</Heading>
          <List.Root as="ul" gap={1} ps={5}>
            <List.Item>
              <Text>
                <strong>src/features</strong>: route-level feature modules
                (login, register, team-members)
              </Text>
            </List.Item>
            <List.Item>
              <Text>
                <strong>src/common</strong>: shared auth, router, ui, and app
                infrastructure
              </Text>
            </List.Item>
            <List.Item>
              <Text>
                <strong>src/data-access</strong>: centralized API calls and
                schema parsing
              </Text>
            </List.Item>
            <List.Item>
              <Text>
                <strong>public/locales</strong>: i18n namespaces for English and
                Greek
              </Text>
            </List.Item>
            <List.Item>
              <Text>
                <strong>mocks</strong>: Mockoon API definitions for local
                backend simulation
              </Text>
            </List.Item>
          </List.Root>
        </VStack>

        <VStack gap={3} align="start">
          <Heading size="md">Example flow in this template</Heading>
          <Text color="gray.700">
            Use <RouterLink to="/team-members">Team Members</RouterLink> to see
            a paginated data-table example, then go to create to open the drawer
            form and submit a new member.
          </Text>
        </VStack>
      </VStack>
    </Box>
  );
}
