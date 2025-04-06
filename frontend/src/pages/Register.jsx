import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router';
import {
  Box,
  Button,
  Input,
  Stack,
  Text,
  Link,
  Heading,
  Field,
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { auth } from '../lib/api';
import { toaster } from '../components/ui/toaster';

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const register = useMutation({
    mutationFn: auth.register,
    onSuccess: () => {
      toaster.create({
        title: 'Registration successful',
        type: 'success',
      });
      navigate('/');
    },
    onError: (error) => {
      toaster.create({
        title: error.response?.data?.message || 'Registration failed',
        type: 'error',
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    register.mutate({ name, email, password });
  };

  return (
    <Box maxW="md" mx="auto" mt={8}>
      <Box bg="gray.900" p={8} rounded="xl" shadow="lg">
        <Stack spacing={6}>
          <Stack spacing={2} textAlign="center">
            <Heading fontSize="2xl">Create an account</Heading>
            <Text color="gray.400">
              Fill in the details below to get started
            </Text>
          </Stack>

          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <Field.Root>
                <Field.Label>Full Name</Field.Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                />
              </Field.Root>
              <Field.Root>
                <Field.Label>Email address</Field.Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                />
              </Field.Root>
              <Field.Root
                css={{
                  position: 'relative',
                }}
              >
                <Field.Label>Password</Field.Label>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  css={{
                    paddingRight: '10',
                  }}
                />
                <IconButton
                  css={{
                    position: 'absolute',
                    top: '7',
                    right: '1',
                  }}
                  onClick={() => setShowPassword(!showPassword)}
                  variant="ghost"
                  size={'sm'}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />}
                </IconButton>
              </Field.Root>

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                fontSize="md"
                isLoading={register.isPending}
              >
                Create account
              </Button>
            </Stack>
          </form>

          <Text textAlign="center">
            Already have an account?{' '}
            <Link as={RouterLink} to="/" color="blue.500">
              Sign in
            </Link>
          </Text>
        </Stack>
      </Box>
    </Box>
  );
}
