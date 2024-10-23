import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Loading from '../components/Loading';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  // update request takes in the following: { firstname, lastname, email, age, denomination, currentPassword, newPassword }

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  interface AuthUser {
    firstname: string;
    lastname: string;
    age: string;
    denomination: string;
    email: string;
  }
  
  const { data:authUser } = useQuery<AuthUser>({queryKey: ['authUser']});
  
  const formData = {
    firstname: authUser?.firstname || '',
    lastname: authUser?.lastname || '',
    email: authUser?.email || '',
    age: authUser?.age || '',
    denomination: authUser?.denomination || '',
    currentPassword: '',
    newPassword: ''
  }

  const [changingPassword, setChangingPassword] = useState<Boolean>(false);

  const { mutate:updateUser, isPending:isUpdating } = useMutation({
    mutationFn: async (formData:{
      firstname?:string;
      lastname?:string;
      email?:string;
      age?:string;
      denomination?:string;
      currentPassword?:string;
      newPassword?:string;
    }) => {
      try {
        
        if (!formData.firstname) {
          throw new Error("First name is required");
        }

        if (!formData.lastname) {
          throw new Error("Last name is required");
        }

        if (!formData.email) {
          throw new Error("Email is required");
        }


        const response = await fetch('/api/user/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
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
      toast.success("Settings updated successfully");
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
      setChangingPassword(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Something went wrong");
      setChangingPassword(false);
    }
  })

  const handleSubmit = () => {
    updateUser(formData);
  }

  const [isDeletingUser, setIsDeletingUser] = useState<Boolean>(false);

  const { mutate:deleteUser, isPending:isPendingDeletingUser } = useMutation({
    mutationFn: async () => {
      try {
        const response = await fetch('/api/user/', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
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
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
      toast.success("Account deleted successfully");
      
      navigate('/');
    },
    onError: (error: Error) => {
      toast.error(error.message || "Something went wrong");
    }
  })

  const handleDeleteAccount = () => {
    deleteUser();
  }

  return (
    <div className="flex gap-12 items-center justify-center w-full h-screen">
      
      {/* Left Side */}
      <div className="flex flex-col items-center w-[25rem]">
        <img src="./images/logo.jpg" alt="" className="w-full rounded-full" />
      </div>

      {/* Right Side */}
      <div className="flex flex-col gap-4 w-[44rem]">
        <h2 className="text-primary text-5xl w-full text-end">Settings</h2>
        <p className="w-full text-end">Customize your preferences to have a more uniquely tailored experience with Guided Gospel!</p>

        <form action="" className="w-full flex flex-col gap-4 justify-center items-center">
          <div className="flex gap-4 w-full">
            <input type="text" name="firstname" placeholder="First Name" defaultValue={formData.firstname} onChange={(e) => formData.firstname = e.target.value} disabled={isUpdating} className="form-input-bar" />
            <input type="text" name="lastname" placeholder="Last Name" defaultValue={formData.lastname} onChange={(e) => formData.lastname = e.target.value} disabled={isUpdating} className="form-input-bar" />
            <input type="number" name="age" placeholder="Age" defaultValue={formData.age}  onChange={(e) => formData.age = e.target.value} disabled={isUpdating} className="form-input-bar !w-1/3" />
          </div>
          <input type="text" name="email" placeholder="Email" defaultValue={formData.email} onChange={(e) => formData.email = e.target.value} disabled={isUpdating} className="form-input-bar" />
          <input type="text" name="denomination" placeholder="Denomination" defaultValue={formData.denomination} onChange={(e) => formData.denomination = e.target.value} disabled={isUpdating} className="form-input-bar" />
          <div className="flex gap-4 w-full justify-end items-center">

            {changingPassword &&
              <div className="flex gap-4 w-full">
                <input type="text" name="currentpassword" placeholder="Current Password" disabled={isUpdating} className="form-input-bar" onChange={(e) => formData.currentPassword = e.target.value} />
                <input type="text" name="newpassword" placeholder="New Password" onChange={(e) => formData.newPassword = e.target.value} disabled={isUpdating} className="form-input-bar" />
              </div>
            }

            <h4 className={`text-end cursor-pointer ${changingPassword ? 'text-red-500' : 'text-primary'}`} 
            onClick={() => {setChangingPassword(!changingPassword)}}
            >
              {changingPassword ? "Cancel" : "Change Password"}
            </h4>
          </div>
          <div className="flex gap-4">
            {!isUpdating && 
              <button 
              disabled={isUpdating}
              onClick={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="bg-primary px-4 py-2 rounded-2xl text-white hover:bg-neutral-800 hover:text-primary transition-all ease-in-out duration-300">Update Settings</button>
            }
            {isUpdating &&
              <Loading size='md' cn='text-primary' />
            }
            <button 
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setIsDeletingUser(true);
            }}
            className="bg-red-500 px-4 py-2 rounded-2xl text-white hover:bg-neutral-800 hover:text-red-500 transition-all ease-in-out duration-300">
              Delete Account
            </button>
          </div>
          
        </form>

      </div>

      {isDeletingUser &&
        <div className="bg-[rgba(0,0,0,0.8)] w-full h-full absolute z-[100] flex items-center justify-center">
            <div className="bg-white w-96 p-4 rounded-2xl flex flex-col">
              <h1 className="text-primary text-3xl">Wait {authUser?.firstname}!</h1>
              <p className="mb-4">Are you sure you want to delete your account?</p>
              <p className="mb-4">By deleting your account you'll lose access to Guided Gospel! You'll have to make another one to chat again.</p>
              <section className="flex gap-4 items-center justify-center">
                <button 
                onClick={handleDeleteAccount}
                className="bg-red-500 px-3 py-1 rounded-2xl text-white hover:text-red-500 hover:bg-neutral-800 transition-all duration-300 ease-in-out">Confirm Delete Account</button>
                <button 
                onClick={() => setIsDeletingUser(false)}
                className="bg-primary px-3 py-1 rounded-2xl hover:bg-green-500 transition-all duration-300 ease-in-out">Cancel</button>
              </section>
            </div>
        </div>
      }
    </div>
  )
}

export default Settings