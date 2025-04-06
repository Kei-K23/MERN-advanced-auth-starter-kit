import {
  Box,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  Stack,
} from '@chakra-ui/react';
import { useAuth } from '../hooks/useAuth';

export default function Dashboard() {
  const { user } = useAuth();
  console.log(user);

  return (
    <Stack spacing={8}>
      <Box>
        <Heading size="lg">Welcome back, {user?.name}! 👋</Heading>
        <Text color="gray.600" mt={2}>
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
  );
}
