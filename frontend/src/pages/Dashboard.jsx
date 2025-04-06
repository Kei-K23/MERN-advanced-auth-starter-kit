import {
  Box,
  SimpleGrid,
  Card,
  Heading,
  Text,
  Stack,
  useDisclosure,
  Field,
  Input,
  Button,
} from '@chakra-ui/react';
import { useAuth } from '../hooks/useAuth';
import { toaster } from '../components/ui/toaster';
import { auth } from '../lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const updateProfile = useMutation({
    mutationFn: auth.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toaster.create({
        title: 'Profile updated successfully',
        type: 'success',
      });
    },
    onError: (error) => {
      toaster.create({
        title: error.response?.data?.message || 'Failed to update profile',
        type: 'error',
      });
    },
  });

  const deleteAccount = useMutation({
    mutationFn: auth.deleteAccount,
    onSuccess: () => {
      localStorage.removeItem('token');
      queryClient.setQueryData(['user'], null);
      toaster.create({
        title: 'Account deleted successfully',
        type: 'success',
      });
      navigate('/');
    },
    onError: (error) => {
      toaster.create({
        title: error.response?.data?.message || 'Failed to delete account',
        type: 'error',
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile.mutate({ name, email });
  };

  return (
    <>
      <Stack spacing={8} maxW="2xl" mx="auto">
        <Box>
          <Heading size="2xl">Welcome back, {user?.name}! 👋</Heading>
          <Text color="gray.400" mt={2}>
            Here's what's happening with your account
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} gapX={'5'}>
          <Card.Root>
            <Card.Body>
              <Card.Title mt="2">Account Status</Card.Title>
              <Card.Description
                color={user?.isVerified ? 'green.500' : 'orange.500'}
                fontWeight="medium"
              >
                {user?.isVerified ? 'Verified' : 'Pending Verification'}
              </Card.Description>
            </Card.Body>
          </Card.Root>
          <Card.Root>
            <Card.Body>
              <Card.Title mt="2">Account Type</Card.Title>
              <Card.Description textTransform="capitalize" fontWeight="medium">
                {user?.role?.toLowerCase()}
              </Card.Description>
            </Card.Body>
          </Card.Root>
          <Card.Root>
            <Card.Body>
              <Card.Title mt="2">Member Since</Card.Title>
              <Card.Description fontWeight="medium">
                {new Date(user?.createdAt).toLocaleDateString()}
              </Card.Description>
            </Card.Body>
          </Card.Root>
        </SimpleGrid>
      </Stack>
      <Stack spacing={8} maxW="2xl" mx="auto" marginTop={'5'}>
        <Card.Root>
          <Card.Body>
            <Card.Title>Profile Settings</Card.Title>
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

                <Button
                  type="submit"
                  variant={'outline'}
                  isLoading={updateProfile.isPending}
                >
                  Save changes
                </Button>
              </Stack>
            </form>
          </Card.Body>
        </Card.Root>

        <Card.Root marginTop={'3'}>
          <Card.Body>
            <Card.Title>Danger Zone</Card.Title>
            <Stack spacing={4}>
              <Text color="gray.400">
                Once you delete your account, there is no going back. Please be
                certain.
              </Text>
              <Button colorPalette="red" variant={'outline'} onClick={onOpen}>
                Delete Account
              </Button>
            </Stack>
          </Card.Body>
        </Card.Root>
        <Button marginTop={3}>Logout</Button>
      </Stack>
    </>
  );
}
