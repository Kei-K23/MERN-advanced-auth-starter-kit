import { useState } from 'react';
import { useNavigate, useSearchParams, Link as RouterLink } from 'react-router';
import {
  Box,
  Button,
  Input,
  Stack,
  Text,
  Link,
  Heading,
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { auth } from '../lib/api';
import { toaster } from '../components/ui/toaster';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');

  const resetPassword = useMutation({
    mutationFn: auth.resetPassword,
    onSuccess: () => {
      toaster.create({
        title: 'Password reset successful',
        type: 'success',
      });
      navigate('/');
    },
    onError: (error) => {
      toaster.create({
        title: error.response?.data?.message || 'Password reset failed',
        type: 'error',
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!token) {
      toaster.create({
        title: 'Invalid reset token',
        type: 'error',
      });
      return;
    }
    resetPassword.mutate({ token, password });
  };

  if (!token) {
    return (
      <Box maxW="md" mx="auto" mt={8}>
        <Box bg="white" p={8} rounded="xl" shadow="lg">
          <Stack spacing={6} textAlign="center">
            <Heading fontSize="2xl" color="red.500">
              Invalid Reset Link
            </Heading>
            <Text color="gray.600">
              This password reset link is invalid or has expired.
            </Text>
            <Link as={RouterLink} to="/forgot-password" color="blue.500">
              Request a new password reset
            </Link>
          </Stack>
        </Box>
      </Box>
    );
  }

  return (
    <Box maxW="md" mx="auto" mt={8}>
      <Box bg="white" p={8} rounded="xl" shadow="lg">
        <Stack spacing={6}>
          <Stack spacing={2} textAlign="center">
            <Heading fontSize="2xl">Reset your password</Heading>
            <Text color="gray.600">Enter your new password below</Text>
          </Stack>

          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
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
                isLoading={resetPassword.isPending}
              >
                Reset password
              </Button>
            </Stack>
          </form>

          <Text textAlign="center">
            Remember your password?{' '}
            <Link as={RouterLink} to="/" color="blue.500">
              Sign in
            </Link>
          </Text>
        </Stack>
      </Box>
    </Box>
  );
}
