import { Outlet } from 'react-router';
import { Box, Container } from '@chakra-ui/react';

export default function Layout() {
  return (
    <Box minH="100vh">
      {/* <Navbar /> */}
      <Container maxW="container.xl" py={8}>
        <Outlet />
      </Container>
    </Box>
  );
}
