import { useEffect } from 'react';
import { useNavigate, useSearchParams, Link as RouterLink } from 'react-router';
import { Box, Stack, Heading, Text, Link, Spinner } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { auth } from '../lib/api';

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const verifyEmail = useMutation({
    mutationFn: auth.verifyEmail,
    onSuccess: () => {
      setTimeout(() => {
        navigate('/');
      }, 3000);
    },
  });

  useEffect(() => {
    if (token) {
      verifyEmail.mutate(token);
    }
  }, [token]);

  if (!token) {
    return (
      <Box maxW="md" mx="auto" mt={8}>
        <Box bg="white" p={8} rounded="xl" shadow="lg">
          <Stack spacing={6} textAlign="center">
            <Heading fontSize="2xl" color="red.500">
              Invalid Verification Link
            </Heading>
            <Text color="gray.600">
              This email verification link is invalid or has expired.
            </Text>
            <Link as={RouterLink} to="/" color="blue.500">
              Return to login
            </Link>
          </Stack>
        </Box>
      </Box>
    );
  }

  if (verifyEmail.isPending) {
    return (
      <Box maxW="md" mx="auto" mt={8}>
        <Box bg="white" p={8} rounded="xl" shadow="lg">
          <Stack spacing={6} align="center">
            <Spinner size="xl" />
            <Text>Verifying your email address...</Text>
          </Stack>
        </Box>
      </Box>
    );
  }

  if (verifyEmail.isError) {
    return (
      <Box maxW="md" mx="auto" mt={8}>
        <Box bg="white" p={8} rounded="xl" shadow="lg">
          <Stack spacing={6}>
            <Alert.Root status="error">
              <Alert.Indicator />
              <Alert.Title>
                Failed to verify your email address. The link may have expired.
              </Alert.Title>
            </Alert.Root>
            <Text textAlign="center">
              <Link as={RouterLink} to="/" color="blue.500">
                Return to login
              </Link>
            </Text>
          </Stack>
        </Box>
      </Box>
    );
  }

  return (
    <Box maxW="md" mx="auto" mt={8}>
      <Box bg="white" p={8} rounded="xl" shadow="lg">
        <Stack spacing={6}>
          <Alert status="success" rounded="md">
            Your email has been verified successfully!
          </Alert>
          <Text textAlign="center">Redirecting to login page...</Text>
        </Stack>
      </Box>
    </Box>
  );
}
