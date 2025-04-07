import { useNavigate, useSearchParams, Link as RouterLink } from 'react-router';
import { Box, Stack, Text, Alert, PinInput } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { auth } from '../lib/api';
import { toaster } from '../components/ui/toaster';

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');

  const verifyEmail = useMutation({
    mutationFn: auth.verifyEmail,
    onSuccess: () => {
      setTimeout(() => {
        navigate('/');
      }, 3000);
    },
    onError: (error) => {
      toaster.create({
        title: error?.response?.data?.message || 'Email verification failed',
        type: 'error',
      });
    },
  });

  if (verifyEmail.isSuccess) {
    return (
      <Box maxW="md" mx="auto" mt={8}>
        <Box bg="gray.800" p={8} rounded="xl" shadow="lg">
          <Alert.Root status="success">
            <Alert.Indicator />
            <Alert.Title>
              Your email has been verified successfully!
            </Alert.Title>
          </Alert.Root>
          <Text textAlign="center">Redirecting to login page...</Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box maxW="md" mx="auto" mt={8}>
      <Box bg={'gray.800'} p={8} rounded="xl" shadow="lg">
        <Stack spacing={6}>
          <PinInput.Root
            onValueComplete={(e) => {
              verifyEmail.mutate({
                email,
                verificationCode: e.valueAsString,
              });
            }}
          >
            <PinInput.HiddenInput />
            <PinInput.Control>
              <PinInput.Input
                boxSize={'14'}
                fontSize={'xl'}
                bg={'gray.700'}
                index={0}
              />
              <PinInput.Input
                boxSize={'14'}
                fontSize={'xl'}
                bg={'gray.700'}
                index={1}
              />
              <PinInput.Input
                boxSize={'14'}
                fontSize={'xl'}
                bg={'gray.700'}
                index={2}
              />
              <PinInput.Input
                boxSize={'14'}
                fontSize={'xl'}
                bg={'gray.700'}
                index={3}
              />
              <PinInput.Input
                boxSize={'14'}
                fontSize={'xl'}
                bg={'gray.700'}
                index={4}
              />
              <PinInput.Input
                boxSize={'14'}
                fontSize={'xl'}
                bg={'gray.700'}
                index={5}
              />
            </PinInput.Control>
          </PinInput.Root>
        </Stack>
      </Box>
    </Box>
  );
}
