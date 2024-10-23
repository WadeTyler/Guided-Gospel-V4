import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';

const Settings = () => {
  // update request takes in the following: { firstname, lastname, email, age, denomination, currentPassword, newPassword }

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
    },
    onError: (error: Error) => {
      toast.error(error.message || "Something went wrong");
    }
  })

  const handleSubmit = () => {
    updateUser(formData);
  }

  return (
    <div className="flex gap-12 items-center justify-center w-full h-screen">
      
      {/* Left Side */}
      <div className="flex flex-col items-center w-1/4">
        <img src="./images/logo.jpg" alt="" className="w-full rounded-full" />
      </div>

      {/* Right Side */}
      <div className="flex flex-col gap-4 w-1/2">
        <h2 className="text-primary text-5xl w-full text-end">Settings</h2>
        <p className="w-full text-end">Customize your preferences to have a more uniquely tailored experience with Guided Gospel!</p>

        <form action="" className="w-full flex flex-col gap-4 justify-center items-center">
          <div className="flex gap-4 w-full">
            <input type="text" name="firstname" placeholder="First Name" defaultValue={formData.firstname} onChange={(e) => formData.firstname = e.target.value} className="form-input-bar" />
            <input type="text" name="lastname" placeholder="Last Name" defaultValue={formData.lastname} onChange={(e) => formData.lastname = e.target.value}className="form-input-bar" />
            <input type="number" name="age" placeholder="Age" defaultValue={formData.age}  onChange={(e) => formData.age = e.target.value}className="form-input-bar !w-1/3" />
          </div>
          <input type="text" name="email" placeholder="Email" defaultValue={formData.email} onChange={(e) => formData.email = e.target.value}className="form-input-bar" />
          <input type="text" name="denomination" placeholder="Denomination" defaultValue={formData.denomination} onChange={(e) => formData.denomination = e.target.value} className="form-input-bar" />
          <div className="flex gap-4 w-full justify-end items-center">

            {changingPassword &&
              <div className="flex gap-4 w-full">
                <input type="text" name="currentpassword" placeholder="Current Password" className="form-input-bar" onChange={(e) => formData.currentPassword = e.target.value} />
                <input type="text" name="newpassword" placeholder="New Password" onChange={(e) => formData.newPassword = e.target.value} className="form-input-bar" />
              </div>
            }

            <h4 className={`text-end cursor-pointer ${changingPassword ? 'text-red-500' : 'text-primary'}`} 
            onClick={() => {setChangingPassword(!changingPassword)}}
            >
              {changingPassword ? "Cancel" : "Change Password"}
            </h4>
          </div>
          <button 
          onClick={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="bg-primary px-4 py-2 rounded-2xl text-white hover:bg-neutral-800 hover:text-primary transition-all ease-in-out duration-300">Update Settings</button>
        </form>

      </div>
    </div>
  )
}

export default Settings