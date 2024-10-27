import { useMutation } from '@tanstack/react-query';
import { SetStateAction, useState } from 'react'
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Loading from '../components/Loading';

const Signup = () => {
  const [signupEmailSent, setSignupEmailSent] = useState<boolean>(false);

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
      toast.success("Verification Email Sent");
      setSignupEmailSent(true);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  })

  const handleSubmit = () => {
    signupMutation({firstname, lastname, email, password});
  }
  
  return (
    <div className='w-full min-h-screen bg-white dark:bg-darkbg flex-col-reverse md:flex-row flex justify-center items-center md:gap-16 gap-8'>
      
      <div className="form-container">
        <h1 className="text-primary text-5xl font-bold w-full md:text-start text-center">{signupEmailSent ? "Check Your Email" : "Signup"}</h1>
        {signupEmailSent && <EmailSent setSignupEmailSent={setSignupEmailSent} />}
        {!signupEmailSent &&
          <form action="" className='w-full flex flex-col gap-4' onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}>
            <input type="text" name="firstname" placeholder='First Name' onChange={(e) => {setFirstname(e.target.value)}}
              className='form-input-bar' />
            <input type="text" name="lastname" placeholder='Last Name' onChange={(e) => {setLastname(e.target.value)}}
              className='form-input-bar' />
            <input type="text" name="email" placeholder='Email' onChange={(e) => {setEmail(e.target.value)}}
              className='form-input-bar' />
            <input type="text" name="password" placeholder='Password' onChange={(e) => {setPassword(e.target.value)}}
              className='form-input-bar' />
            
            {isPending && 
              <div className="w-full flex items-center justify-center">
                <Loading size='sm' cn="text-primary text-center" />
              </div>
            }
            {!isPending && <button className="bg-primary px-4 py-2 rounded-2xl text-white hover:bg-neutral-800 hover:text-primary transition-all ease-in-out duration-300">Signup</button>}
          </form>
        }
        {!signupEmailSent && <Link to="/login" className="dark:text-darktext underline w-full text-center">Already have an account? Login</Link>}
      </div>

      <div className="logo-container">
        <img src="./images/logo-3.png" alt="guided gospel logo" className='rounded-full' />
      </div>

    </div>
  )
}

const EmailSent = ({setSignupEmailSent} : {setSignupEmailSent: React.Dispatch<SetStateAction<boolean>>}) => {
  return (
    <div className="flex flex-col gap-4">
      <p className="dark:text-darktext md:text-start text-center">A verification email has been sent to your provided email. You must follow the steps in the email to complete your account registration.</p>
      <p className="dark:text-darktext underline cursor-pointer md:text-start text-center" onClick={() => {
        setSignupEmailSent(false);
      }}>Didn't get an Email? Try Again</p>
    </div>
  )
}

export default Signup