import { useEffect } from 'react'
import Loading from '../components/Loading'
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";

import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data:authUser } = useQuery({queryKey: ['authUser']});
  
  const { mutate:logoutMutation } = useMutation({
    mutationFn: async () => {
      try {
        const response = await fetch('/api/user/logout', {
          method: 'POST'
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Something went wrong");
        }
         
      } catch (error) {
        throw new Error((error as Error).message);
      }
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['authUser']});
      queryClient.invalidateQueries({ queryKey: ['authAdmin']});
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ['authUser']});
      queryClient.invalidateQueries({ queryKey: ['authAdmin']});
    }
  });

  useEffect(() => {
    logoutMutation();
  }, []);

  

  useEffect(() => {
    if (!authUser) navigate('/');
  }, [authUser])

  return (
    <div className="flex w-full min-h-screen justify-center items-center">
      <Loading size='lg' />
    </div>
  )
}

export default Logout