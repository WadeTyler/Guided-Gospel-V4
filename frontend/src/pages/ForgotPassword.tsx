
import React, { useState } from 'react';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [emailSent, setEmailSent] = useState<boolean>(false);
  

  return (
    !emailSent ? <ForgotPasswordForm setEmailSent={setEmailSent} /> : <EmailSent setEmailSent={setEmailSent} />
  );
}


const ForgotPasswordForm = ({setEmailSent }: {setEmailSent: React.Dispatch<React.SetStateAction<boolean>>}) => {

  const [email, setEmail] = useState<string>('');

  const submitForm = async () => {
    try {
      const response = await fetch('/api/user/forgotpassword/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({email})
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setEmailSent(true);
      toast.success("Email Sent");

    } catch (error) {
      toast.error((error as Error).message);
    }
  }

  const handleSubmit = () => {
    submitForm();
  }

  return (
    <div className='w-full h-screen bg-white flex justify-center items-center gap-16'>
        
        <div className="w-[30rem] h-96 flex flex-col justify-center items-center gap-4">
          <h1 className="text-primary text-5xl font-bold w-full">Password Recovery</h1>
          <p className="text-neutral-800">Once you submit this form, please follow the steps in the email to recover your password.</p>
          <form action="" className='w-full flex flex-col gap-4' onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}>

            <input type="text" className="form-input-bar" placeholder='Email' onChange={(e) => {
              setEmail(e.target.value);
              
            }}/>

            <button className="submit-btn">Get Email</button>

          </form>

        </div>


        <div className="w-96">
          <img src="./images/logo-3.png" alt="guided gospel logo" className='rounded-full' />
        </div>
      </div>
  );
}

const EmailSent = ({setEmailSent} : {setEmailSent: React.Dispatch<React.SetStateAction<boolean>>}) => {
  return (
    <div className="w-full h-screen flex items-center justify-center flex-col text-center">
      <h1 className="text-primary text-5xl font-bold w-full">Recovery Email Sent</h1>
      <p className="">Check your email for further instructions to recover your password.</p>
      <p className="text-primary cursor-pointer" onClick={() => {
        setEmailSent(false);
      }}>Wrong email? Click Here to try again.</p>
    </div>
  );
}

export default ForgotPassword