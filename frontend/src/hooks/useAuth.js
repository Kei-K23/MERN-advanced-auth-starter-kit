import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { auth } from '../lib/api';
import { siteConfig } from '../config';
import Cookies from 'js-cookie';

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        const { data } = await auth.getProfile();

        return data;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
  });

  const logout = useMutation({
    mutationFn: auth.logout,
    onSuccess: () => {
      Cookies.remove(siteConfig.ACCESS_TOKEN_COOKIE_KEY);
      localStorage.removeItem('token');
      queryClient.setQueryData(['user'], null);
    },
  });

  return {
    user,
    isLoading,
    logout: logout.mutate,
  };
}
