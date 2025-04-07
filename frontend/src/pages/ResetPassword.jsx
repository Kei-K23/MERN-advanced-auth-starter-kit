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
  Field,
  IconButton,
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { auth } from '../lib/api';
import { toaster } from '../components/ui/toaster';
import { LuEye, LuEyeOff } from 'react-icons/lu';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

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
    if (!verificationCode) {
      toaster.create({
        title: 'Missing password reset code',
        type: 'error',
      });
    }
    resetPassword.mutate({ verificationCode, email, newPassword: password });
  };

  return (
    <Box maxW="md" mx="auto" mt={8}>
      <Box bg="gray.900" p={8} rounded="xl" shadow="lg">
        <Stack spacing={6}>
          <Stack spacing={2} textAlign="center">
            <Heading fontSize="2xl">Reset your password</Heading>
            <Text color="gray.600">Enter your new password below</Text>
          </Stack>

          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <Field.Root>
                <Field.Label>Password Reset Code</Field.Label>
                <Input
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter password reset code"
                />
              </Field.Root>

              <Field.Root
                css={{
                  position: 'relative',
                }}
              >
                <Field.Label>New Password</Field.Label>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your new password"
                  css={{
                    paddingRight: '10',
                  }}
                  required
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
