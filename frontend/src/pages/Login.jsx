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
  IconButton,
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { auth } from '../lib/api';
import { toaster } from '../components/ui/toaster';
import { LuEye, LuEyeOff } from 'react-icons/lu';
import Cookies from 'js-cookie';
import { siteConfig } from '../config';

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = useMutation({
    mutationFn: auth.login,
    onSuccess: (response) => {
      Cookies.set(
        siteConfig.ACCESS_TOKEN_COOKIE_KEY,
        response.data.accessToken,
        {
          expires: siteConfig.ACCESS_TOKEN_EXPIRES_IN,
        },
      );

      toaster.create({
        title: response.data.message,
        type: 'success',
      });

      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    },
    onError: (error) => {
      toaster.create({
        title: error.response?.data?.message || 'Login failed',
        type: 'error',
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    login.mutate({ email, password });
  };

  return (
    <Box maxW="md" mx="auto" mt={8}>
      <Box bg="gray.900" p={8} rounded="xl" shadow="lg">
        <Stack spacing={6}>
          <Stack spacing={2} textAlign="center">
            <Heading fontSize="2xl">Welcome back</Heading>
            <Text color="gray.400">
              Enter your credentials to access your account
            </Text>
          </Stack>

          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <Field.Root>
                <Field.Label>Email</Field.Label>
                <Input
                  type="email"
                  value={email}
                  required
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

              <Stack spacing={2}>
                <Link
                  as={RouterLink}
                  to="/forgot-password"
                  color="blue.500"
                  fontSize="sm"
                  textAlign="right"
                >
                  Forgot password?
                </Link>
                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  fontSize="md"
                  isLoading={login.isPending}
                >
                  Sign in
                </Button>
              </Stack>
            </Stack>
          </form>

          <Text textAlign="center">
            Don't have an account?{' '}
            <Link as={RouterLink} to="/register" color="blue.500">
              Sign up
            </Link>
          </Text>
        </Stack>
      </Box>
    </Box>
  );
}
