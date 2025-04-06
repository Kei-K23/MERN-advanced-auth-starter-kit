import { useNavigate } from 'react-router';
import { Box, Flex, Button, Menu, Avatar, Portal } from '@chakra-ui/react';
import { useAuth } from '../hooks/useAuth';
import { toaster } from './ui/toaster';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toaster.create({
        title: 'Logged out successfully',
        type: 'success',
      });
      navigate('/');
    } catch (error) {
      console.log(error);
      toaster.create({
        title: 'Error logging out',
        type: 'error',
      });
    }
  };

  return (
    <Box bg="white" px={4} shadow="sm">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Box
          fontSize="xl"
          fontWeight="bold"
          cursor="pointer"
          onClick={() => navigate(user ? '/dashboard' : '/')}
        >
          Auth System
        </Box>

        {user ? (
          <Menu.Root>
            <Menu.Trigger asChild>
              <Button variant="outline" size="sm">
                <Avatar size="sm" name={user.name} />
              </Button>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content>
                  <Menu.Item value="new-txt">Profile</Menu.Item>
                  <Menu.Item value="new-file">Logout</Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        ) : (
          //   <Menu>
          //     <MenuButton
          //       as={Button}
          //       rounded="full"
          //       variant="link"
          //       cursor="pointer"
          //       minW={0}
          //     >
          //       <Avatar size="sm" name={user.name} />
          //     </MenuButton>
          //     <MenuList>
          //       <MenuItem
          //         icon={<User size={18} />}
          //         onClick={() => navigate('/profile')}
          //       >
          //         Profile
          //       </MenuItem>
          //       <MenuItem icon={<LogOut size={18} />} onClick={handleLogout}>
          //         Logout
          //       </MenuItem>
          //     </MenuList>
          //   </Menu>
          <Button onClick={() => navigate('/login')}>Login</Button>
        )}
      </Flex>
    </Box>
  );
}
