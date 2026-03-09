import { Box, Container, Flex, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { NavLink, Outlet } from 'react-router-dom';

const navigation = [
  { nameKey: 'navigation.home', path: '/' },
  { nameKey: 'navigation.teamMembers', path: '/team-members' },
{{ADVANCED_NAV_ENTRY}}];

export function AppLayout() {
  const { t } = useTranslation();

  return (
    <Flex minH="100vh" bg="gray.50">
      <Box
        as="nav"
        w="250px"
        bg="white"
        borderRightWidth="1px"
        borderColor="gray.200"
        p={4}
      >
        <VStack align="stretch" gap={2}>
          <Text fontSize="xl" fontWeight="bold" mb={4} px={3}>
            {t('appName')}
          </Text>
          {navigation.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              style={({ isActive }) => ({
                display: 'block',
                padding: 'var(--chakra-spacing-2) var(--chakra-spacing-3)',
                borderRadius: 'var(--chakra-radii-md)',
                backgroundColor: isActive
                  ? 'var(--chakra-colors-blue-50)'
                  : 'transparent',
                color: isActive
                  ? 'var(--chakra-colors-blue-600)'
                  : 'var(--chakra-colors-gray-700)',
                fontWeight: isActive ? 600 : 400,
                transition: 'all 0.2s',
              })}
            >
              {t(item.nameKey)}
            </NavLink>
          ))}
        </VStack>
      </Box>

      <Flex flex="1" direction="column">
        <Box as="main" flex="1" overflowY="auto">
          <Container maxW="container.xl" py={6}>
            <Outlet />
          </Container>
        </Box>
      </Flex>
    </Flex>
  );
}
