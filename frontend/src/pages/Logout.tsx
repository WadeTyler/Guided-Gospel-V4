import { useEffect } from 'react'
import Loading from '../components/Loading'
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data:authUser, refetch } = useQuery({queryKey: ['authUser']});
  
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
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ['authUser']});
    }
  });

  useEffect(() => {
    logoutMutation();
  }, []);

  

  useEffect(() => {
    if (!authUser) navigate('/');
  }, [authUser])

  return (
    <div className="flex w-full h-screen justify-center items-center">
      <Loading size='lg' />
    </div>
  )
}

export default Logout