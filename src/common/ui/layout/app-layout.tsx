import {
  Box,
  Container,
  Flex,
  HStack,
  Menu,
  Portal,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '~/common/auth';

const navigation = [
  { nameKey: 'navigation.home', path: '/' },
  { nameKey: 'navigation.teamMembers', path: '/team-members' },
  { nameKey: 'navigation.advancedForm', path: '/advanced-form' },
];

export function AppLayout() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();

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
        <Box
          as="header"
          bg="white"
          borderBottomWidth="1px"
          borderColor="gray.200"
          px={6}
          py={3}
        >
          <Flex justify="flex-end" align="center">
            <HStack gap={4}>
              <Text fontSize="sm" color="gray.600">
                {user?.name}
              </Text>

              <Menu.Root
                positioning={{
                  placement: 'bottom-end',
                  offset: { mainAxis: 8 },
                }}
              >
                <Menu.Trigger asChild>
                  <Box
                    as="button"
                    w="10"
                    h="10"
                    borderRadius="full"
                    bg="blue.500"
                    color="white"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontWeight="bold"
                    fontSize="sm"
                    cursor="pointer"
                    _hover={{ bg: 'blue.600' }}
                    transition="all 0.2s"
                  >
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </Box>
                </Menu.Trigger>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content minW="150px">
                      <Menu.Item
                        value="logout"
                        color="red.500"
                        onClick={logout}
                      >
                        {t('actions.logout')}
                      </Menu.Item>
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>
            </HStack>
          </Flex>
        </Box>

        <Box as="main" flex="1" overflowY="auto">
          <Container maxW="container.xl" py={6}>
            <Outlet />
          </Container>
        </Box>
      </Flex>
    </Flex>
  );
}
