import {
  Box,
  SimpleGrid,
  Card,
  Heading,
  Text,
  Stack,
  Field,
  Input,
  Button,
  Dialog,
  Portal,
  CloseButton,
  Tabs,
} from '@chakra-ui/react';
import { useAuth } from '../hooks/useAuth';
import { toaster } from '../components/ui/toaster';
import { auth } from '../lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
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
      // Close the dialog
      setOpen(false);
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

        <Tabs.Root defaultValue="dashboard">
          <Tabs.List>
            <Tabs.Trigger value="dashboard">Dashboard</Tabs.Trigger>
            <Tabs.Trigger value="activities">Activities</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="dashboard">
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
                  <Card.Description
                    textTransform="capitalize"
                    fontWeight="medium"
                  >
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

                      <Button type="submit" isLoading={updateProfile.isPending}>
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
                      Once you delete your account, there is no going back.
                      Please be certain.
                    </Text>
                    <Button
                      colorPalette="red"
                      variant={'outline'}
                      onClick={() => setOpen(true)}
                    >
                      Delete Account
                    </Button>
                  </Stack>
                </Card.Body>
              </Card.Root>
              <Button
                marginTop={3}
                onClick={() => {
                  logout();
                  toaster.create({
                    title: 'Successfully logout',
                    type: 'success',
                  });
                  navigate('/');
                }}
              >
                Logout
              </Button>
            </Stack>
          </Tabs.Content>
          <Tabs.Content value="activities">
            <Stack>
              {user.activities?.map((activity) => (
                <Card.Root>
                  <Card.Header>
                    <Card.Title>{activity.action}</Card.Title>
                  </Card.Header>
                  <Card.Body>
                    <Text>IP address - {activity.ip}</Text>
                    <Text>{activity?.createdAt}</Text>
                  </Card.Body>
                </Card.Root>
              ))}
            </Stack>
          </Tabs.Content>
        </Tabs.Root>
      </Stack>
      <Dialog.Root lazyMount open={open} onOpenChange={(e) => setOpen(e.open)}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Are you sure?</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                Once you delete your account, there is no going back. Please be
                certain.
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </Dialog.ActionTrigger>
                <Button
                  colorPalette={'red'}
                  onClick={() => {
                    deleteAccount.mutate();
                  }}
                >
                  Delete
                </Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
}
