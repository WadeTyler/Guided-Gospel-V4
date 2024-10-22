import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react'
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Loading from '../components/Loading';

const Signup = () => {
  const queryClient = useQueryClient();

  const [firstname, setFirstname] = useState<string>('');
  const [lastname, setLastname] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const {mutate:signupMutation, isPending} = useMutation({
    mutationFn: async ({firstname, lastname, email, password}: {firstname: string; lastname: string; email: string; password: string}) => {
      try {
        const response = await fetch('/api/user/signup', {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({firstname, lastname, email, password})
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
      toast.success("Signup successful");
      queryClient.invalidateQueries({queryKey: ['authUser']});
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  })

  const handleSubmit = () => {
    signupMutation({firstname, lastname, email, password});
  }
  
  return (
    <div className='w-full h-screen bg-white flex justify-center items-center gap-16'>
      
      <div className="w-96 h-96 flex flex-col justify-center items-center gap-4">
        <h1 className="text-primary text-5xl font-bold text-start w-full">Signup</h1>
        <form action="" className='w-full flex flex-col gap-4' onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}>
          <input type="text" name="firstname" placeholder='First Name' onChange={(e) => {setFirstname(e.target.value)}}
            className='border-primary border-[1px] rounded-2xl text-zinc-700 w-full hover:shadow-lg focus:shadow-lg focus:outline-none' />
          <input type="text" name="lastname" placeholder='Last Name' onChange={(e) => {setLastname(e.target.value)}}
            className='border-primary border-[1px] rounded-2xl text-zinc-700 w-full hover:shadow-lg focus:shadow-lg focus:outline-none' />
          <input type="text" name="email" placeholder='Email' onChange={(e) => {setEmail(e.target.value)}}
            className='border-primary border-[1px] rounded-2xl text-zinc-700 w-full hover:shadow-lg focus:shadow-lg focus:outline-none' />
          <input type="text" name="password" placeholder='Password' onChange={(e) => {setPassword(e.target.value)}}
            className='border-primary border-[1px] rounded-2xl text-zinc-700 w-full hover:shadow-lg focus:shadow-lg focus:outline-none' />
          
          {isPending && 
            <div className="w-full flex items-center justify-center">
              <Loading size='sm' cn="text-primary text-center" />
            </div>
          }
          {!isPending && <button className="bg-primary px-4 py-2 rounded-2xl text-white">Signup</button>}
        </form>
        <Link to="/login" className="text-secondary underline">Already have an account? Login</Link>
      </div>

      <div className="w-96">
        <img src="./images/logo.jpg" alt="guided gospel logo" className='rounded-full' />
      </div>

    </div>
  )
}

export default Signup