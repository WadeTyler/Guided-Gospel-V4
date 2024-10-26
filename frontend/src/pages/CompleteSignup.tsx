import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Loading from "../components/Loading";


const CompleteSignup = () => {

  const [signupCompleted, setSignupCompleted] = useState<boolean>(false);
  const [invalidToken, setInvalidToken] = useState<boolean>(false);
  
  const verificationToken = useParams<{verificationToken: string}>();

  const completeSignup = async () => {
    try {
      const response = await fetch('/api/user/completesignup', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({verificationToken: verificationToken.verificationToken})
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setSignupCompleted(true);
      
      toast.success("Account Created Successfully");
      
    } catch (error) {
      setInvalidToken(true);
      toast.error((error as Error).message || "Something went wrong");
    }
  }

  useEffect(() => {
    completeSignup();
  }, [])


  return (
    <>
      {signupCompleted && <RegistrationComplete />}
      {invalidToken && !signupCompleted &&  <InvalidToken />}
      {!signupCompleted && !invalidToken && 
        <div className="w-full h-screen flex items-center justify-center">
          <Loading size="lg" cn="text-primary" />
        </div>
      }
      
    </>
  )
}

const RegistrationComplete = () => {
  return (
    <div className="w-full h-screen bg-white dark:bg-darkbg flex justify-center items-center gap-16">
      <div className="w-96">
        <img src="/images/logo-3.png" alt="guided gospel logo" className='rounded-full' />
      </div>

      <div className="flex flex-col gap-4 items-center">
        <h1 className="text-primary text-5xl font-bold w-full text-right">Registration Complete</h1>
        <p className="dark:text-darktext">Your Account has been successfully created!</p>
        <Link to="/chat" className="submit-btn flex items-center justify-center w-fit" onClick={() => useQueryClient().invalidateQueries({ queryKey: ['authUser'] })}>Get Started</Link>
      </div>

    </div>
  )
}

const InvalidToken = () => {
  return (
    <div className="w-full h-screen bg-white dark:bg-darkbg flex justify-center items-center gap-16">
      <div className="w-96">
        <img src="/images/logo-3.png" alt="guided gospel logo" className='rounded-full' />
      </div>

      <div className="flex flex-col gap-4 items-center">
        <h1 className="text-primary text-5xl font-bold w-full text-right">This Link has expired</h1>
        <p className="dark:text-darktext">Please try again</p>
        <Link to="/login" className="submit-btn flex items-center justify-center w-fit" >Sign Up</Link>
      </div>

    </div>
  )
}

export default CompleteSignup