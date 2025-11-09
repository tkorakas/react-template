import { Box, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';

import { useAuth } from '~/common/auth';
import { getTodos } from '~/data-access/api';
import { Button } from '~/ui';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email'),
});

type FormData = z.infer<typeof formSchema>;

interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface TodosResponse {
  data: Todo[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const fetchTodos = async (): Promise<TodosResponse> => {
  try {
    return (await getTodos(1, 5)) as TodosResponse;
  } catch {
    throw new Error('Failed to fetch todos');
  }
};

function HomePage() {
  const { user, logout } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormData) => {
    alert(`Form submitted: ${data.name} (${data.email})`);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <Box p={8}>
      <Box mb={6} p={4} bg="gray.50" borderRadius="md">
        <HStack justify="space-between">
          <Box>
            <Text fontSize="lg" fontWeight="semibold">
              Welcome, {user?.name}!
            </Text>
            <Text fontSize="sm" color="gray.600">
              {user?.email}
            </Text>
          </Box>
          <Button
            variant="outline"
            colorScheme="red"
            size="sm"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </HStack>
      </Box>

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

        <Box>
          <Heading size="md" mb={4}>
            Todos from Mock Server:
          </Heading>
          {isLoading && <Text>Loading...</Text>}
          {error && <Text color="red.500">Error: {error.message}</Text>}
          {data && (
            <VStack gap={3} align="start">
              <Text fontSize="sm" color="gray.600">
                Showing {data.data.length} of {data.total} todos (Page{' '}
                {data.page} of {data.totalPages})
              </Text>
              {data.data.map(todo => (
                <Box
                  key={todo.id}
                  p={4}
                  borderWidth={1}
                  borderRadius="md"
                  w="full"
                >
                  <Text
                    fontWeight="bold"
                    color={todo.completed ? 'green.600' : 'gray.700'}
                  >
                    {todo.completed ? '✅' : '⏳'} {todo.title}
                  </Text>
                  {todo.description && (
                    <Text fontSize="sm" color="gray.600" mt={1}>
                      {todo.description}
                    </Text>
                  )}
                  <Text fontSize="xs" color="gray.500" mt={2}>
                    Priority: {todo.priority} | Due:{' '}
                    {todo.dueDate || 'No due date'}
                  </Text>
                </Box>
              ))}
            </VStack>
          )}
        </Box>

        <Box>
          <Heading size="md" mb={4}>
            Example Form with Validation:
          </Heading>
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack gap={4} align="start">
              <Box>
                <input
                  {...register('name')}
                  placeholder="Your name"
                  style={{
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                  }}
                />
                {errors.name && (
                  <Text color="red.500" fontSize="sm">
                    {errors.name.message}
                  </Text>
                )}
              </Box>

              <Box>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="Your email"
                  style={{
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                  }}
                />
                {errors.email && (
                  <Text color="red.500" fontSize="sm">
                    {errors.email.message}
                  </Text>
                )}
              </Box>

              <Button type="submit" variant="primary">
                Submit
              </Button>
            </VStack>
          </form>
        </Box>

        <Link to="/about">
          <Button variant="outline">Go to About Page</Button>
        </Link>
      </VStack>
    </Box>
  );
}

export default HomePage;
