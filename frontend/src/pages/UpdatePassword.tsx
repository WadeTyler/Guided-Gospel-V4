import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const UpdatePassword = () => {
  const { recoveryToken } = useParams<{recoveryToken: string}>(); // Get the recovery token from the URL
  const [invalidToken, setInvalidToken] = useState<boolean>(false);

  const [passwordUpdated, setPasswordUpdated] = useState<boolean>(false);

  const checkIsValidRecoveryToken = async () => {
    try {
      const response = await fetch(`/api/user/validrecoverytoken/${recoveryToken}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }
      

      console.log(data);
    } catch (error) {
      toast.error((error as Error).message);
      setInvalidToken(true);
    }
  }

  useEffect(() => {
    checkIsValidRecoveryToken();
  }, []);

  if (!recoveryToken || invalidToken) {
    return (
      <div className='w-full min-h-screen flex flex-col items-center justify-center'>
        <p className="text-5xl font-bold text-primary">Invalid Link or This session has expired</p>
        <Link to="/forgotpassword" className="underline">Click here to recover your password</Link>
      </div>
    )
  }

  return (
    passwordUpdated ? <RedirectingHome /> : <UpdatePasswordForm recoveryToken={recoveryToken} setPasswordUpdated={setPasswordUpdated} />
  )
}

const UpdatePasswordForm = ({ recoveryToken, setPasswordUpdated }: { recoveryToken: string, setPasswordUpdated: React.Dispatch<React.SetStateAction<boolean>> }) => {
  


  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/user/resetpassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({recoveryToken, newPassword, confirmNewPassword})
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      toast.success("Password updated successfully");
      setPasswordUpdated(true);

    } catch (error) {
      toast.error((error as Error).message);
    }
  }

  return (
    <div className='w-full min-h-screen bg-white dark:bg-darkbg flex justify-center items-center gap-16'>
        
        <div className="w-[30rem] h-96 flex flex-col justify-center items-center gap-4">
          <h1 className="text-primary text-5xl font-bold w-full">Reset Password</h1>
          <p className="text-neutral-800 dark:text-darktext text-left w-full">Please enter your new password.</p>
          <form action="" className='w-full flex flex-col gap-4' onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}>


            <input type="text" className="form-input-bar" placeholder='New Password' onChange={(e) => {
              setNewPassword(e.target.value);
            }}/>

            <input type="text" className="form-input-bar" placeholder='Confirm New Password' onChange={(e) => {
              setConfirmNewPassword(e.target.value);
            }}/>

            <button className="submit-btn">Reset Password</button>



          </form>

        </div>


        <div className="w-96">
          <img src="/images/logo-3.png" alt="guided gospel logo" className='rounded-full' />
        </div>
      </div>
  )
}

const RedirectingHome = () => {
  const navigate = useNavigate();
  const [timer, setTimer] = useState<number>(5);
  


  useEffect(() => {

    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 0) {
          clearInterval(interval);
          navigate('/login');
          return 0;
        }

        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);

  }, [])

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-white dark:bg-darkbg">
      <p className="text-4xl text-primary">Password Updated Successfully. Redirecting you to Login in {timer}</p>
      <Link to="/login" className="text-secondary dark:text-darktext underline">Click here if you are not redirected</Link>
    </div>
  )
}

export default UpdatePassword