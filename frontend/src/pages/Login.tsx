import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Loading from '../components/Loading';

const Login = () => {

  const queryClient = useQueryClient();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const {mutate:loginMutation, isPending, error} = useMutation({
    mutationFn: async ({email, password}: {email: string; password: string}) => {
      try {
        const response = await fetch('/api/user/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({email, password})
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error((error as Error).message);
      }
    },
    onSuccess: () => {
      toast.success("Logged in successfully");
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Something went wrong");
    }
  })

  const handleSubmit = () => {
    console.log("Attempting Login...");
    loginMutation({email, password});
  }

  return (
    <div className='w-full h-screen bg-white flex justify-center items-center gap-16'>

      <div className="w-96">
        <img src="./images/logo.jpg" alt="guided gospel logo" className='rounded-full' />
      </div>

      <div className="w-96 h-96 flex flex-col justify-center items-center gap-4">
        <h1 className="text-primary text-5xl font-bold text-end w-full">Login</h1>
        <form action="" className='w-full flex flex-col gap-4' onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}>
          <input type="text" name="email" placeholder='Email' onChange={(e) => {setEmail(e.target.value)}}
          className='border-primary border-[1px] rounded-2xl text-zinc-700 w-full hover:shadow-lg focus:shadow-lg focus:outline-none' />
          <input type="text" name="password" placeholder='Password' onChange={(e) => {setPassword(e.target.value)}}
          className='border-primary border-[1px] rounded-2xl text-zinc-700 w-full hover:shadow-lg focus:shadow-lg focus:outline-none' />
          {isPending 
            ? 
            <Loading size="lg" /> 
            :
            <button className="bg-primary px-4 py-2 rounded-2xl text-white">Login</button>
          }
        </form>
        <Link to="/signup" className="text-secondary underline">Don't have an account? Signup</Link>
      </div>
    </div>
  )
}

export default Login