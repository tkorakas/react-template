// Example usage for Login Page:
// import { AuthLayout, SimpleForm, TextInput } from '~/ui';
//
// export default function LoginPage() {
//   const { form, handleSubmit, isLoading, error } = useLoginHandler();
//   const { register, formState: { errors } } = form;
//
//   return (
//     <AuthLayout>
//       <Box textAlign="center">
//         <Heading size="lg" mb={2}>Welcome Back</Heading>
//         <Text color="gray.600">Please sign in to your account</Text>
//       </Box>
//
//       {error && (
//         <Box p={4} bg="red.50" borderRadius="md" borderLeftWidth="4px" borderLeftColor="red.500">
//           <Text color="red.700" fontSize="sm">{error}</Text>
//         </Box>
//       )}
//
//       <SimpleForm onSubmit={handleSubmit}>
//         <TextInput
//           type="email"
//           label="Email"
//           placeholder="Enter your email"
//           error={errors.email?.message}
//           {...register('email')}
//         />
//         <TextInput
//           type="password"
//           label="Password"
//           placeholder="Enter your password"
//           error={errors.password?.message}
//           {...register('password')}
//         />
//         <Button type="submit" colorScheme="blue" size="lg" loading={isLoading}>
//           {isLoading ? 'Signing in...' : 'Sign In'}
//         </Button>
//       </SimpleForm>
//
//       <Box position="relative" textAlign="center" my={6}>
//         <Separator />
//         <Box position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)" bg="white" px={3}>
//           <Text fontSize="sm" color="gray.500">OR</Text>
//         </Box>
//       </Box>
//
//       <OAuthButton provider="github">Sign in with GitHub</OAuthButton>
//
//       <Box textAlign="center">
//         <HStack justify="center" gap={1}>
//           <Text fontSize="sm" color="gray.600">Don't have an account?</Text>
//           <Link to="/register">
//             <Button variant="plain" colorScheme="blue" size="sm" p={0}>Sign up here</Button>
//           </Link>
//         </HStack>
//       </Box>
//     </AuthLayout>
//   );
// }

// Example usage for Register Page:
// import { AuthLayout, SimpleForm, TextInput } from '~/ui';
//
// export default function RegisterPage() {
//   const { form, isLoading, handleSubmit, error } = useRegisterHandler();
//
//   return (
//     <AuthLayout
//       title="Create Account"
//       description="Sign up for a new account"
//       linkText="Already have an account?"
//       linkHref="/login"
//       linkLabel="Sign in here"
//       variant="card"
//     >
//       {error && (
//         <Alert.Root status="error">
//           <Alert.Description>Registration failed: {error.message}</Alert.Description>
//         </Alert.Root>
//       )}
//
//       <SimpleForm onSubmit={handleSubmit}>
//         <TextInput {...form.register('name')} type="text" label="Full Name" placeholder="Enter your full name" disabled={isLoading} error={form.formState.errors.name?.message} />
//         <TextInput {...form.register('email')} type="email" label="Email" placeholder="Enter your email" disabled={isLoading} error={form.formState.errors.email?.message} />
//         <TextInput {...form.register('password')} type="password" label="Password" placeholder="Enter your password" disabled={isLoading} error={form.formState.errors.password?.message} />
//         <Button type="submit" loading={isLoading} loadingText="Creating account..." width="full">Create Account</Button>
//       </SimpleForm>
//     </AuthLayout>
//   );
// }
