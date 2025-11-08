import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import ky from 'ky';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email'),
});

type FormData = z.infer<typeof formSchema>;

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

const fetchExample = async (): Promise<Post> => {
  try {
    return await ky
      .get('https://jsonplaceholder.typicode.com/posts/1')
      .json<Post>();
  } catch {
    throw new Error('Failed to fetch data');
  }
};

function HomePage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['example'],
    queryFn: fetchExample,
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

  return (
    <Box p={8}>
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
            Example API Data:
          </Heading>
          {isLoading && <Text>Loading...</Text>}
          {error && <Text color="red.500">Error: {error.message}</Text>}
          {data && (
            <Box p={4} borderWidth={1} borderRadius="md">
              <Text fontWeight="bold">{data.title}</Text>
              <Text>{data.body}</Text>
            </Box>
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

              <Button type="submit" colorScheme="blue">
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
