import { useState } from 'react';
import {
  Button,
  Input,
  Stack,
  Heading,
  Card,
  CardHeader,
  CardBody,
  Text,
  useDisclosure,
  Field,
} from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { auth } from '../lib/api';
import { toaster } from '../components/ui/toaster';

export default function Profile() {
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
    <Stack spacing={8} maxW="2xl" mx="auto">
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
                colorScheme="blue"
                isLoading={updateProfile.isPending}
              >
                Save changes
              </Button>
            </Stack>
          </form>
        </Card.Body>
      </Card.Root>

      <Card.Root>
        <CardBody>
          <Card.Title>Danger Zone</Card.Title>
          <Stack spacing={4}>
            <Text color="gray.600">
              Once you delete your account, there is no going back. Please be
              certain.
            </Text>
            <Button colorScheme="red" variant="outline" onClick={onOpen}>
              Delete Account
            </Button>
          </Stack>
        </CardBody>
      </Card.Root>
    </Stack>
  );
}
