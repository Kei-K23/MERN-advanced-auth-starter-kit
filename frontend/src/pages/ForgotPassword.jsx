import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router';
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

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const forgotPassword = useMutation({
    mutationFn: auth.forgotPassword,
    onSuccess: () => {
      toaster.create({
        title: 'Successfully send password reset code',
        type: 'success',
      });
      navigate(`/reset-password?email=${email}`);
    },
    onError: (error) => {
      toaster.create({
        title: error.response?.data?.message || 'Failed to send reset email',
        type: 'error',
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    forgotPassword.mutate(email);
  };

  return (
    <Box maxW="md" mx="auto" mt={8}>
      <Box bg="gray.900" p={8} rounded="xl" shadow="lg">
        <Stack spacing={6}>
          <Stack spacing={2} textAlign="center">
            <Heading fontSize="2xl">Forgot your password?</Heading>
            <Text color="gray.400">
              Enter your email address and we'll send you instructions to reset
              your password
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

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                fontSize="md"
                isLoading={forgotPassword.isPending}
              >
                Submit
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
