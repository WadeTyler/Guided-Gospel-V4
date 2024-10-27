import React, { useState } from 'react'
import toast from 'react-hot-toast';

const ChangeRates = ({user, setChangingRates, setUserData}:{user:User; setChangingRates: React.Dispatch<React.SetStateAction<Boolean>>; setUserData: () => void;}) => {

  const [newRates, setNewRates] = useState<number>(50);

  const submitChangeRates = async () => {
    try {
      const response = await fetch(`/api/admin/users/${user.userid}/setDefaultRates`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({newRates})
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setUserData();
      setChangingRates(false);

    } catch (error) {
      toast.error((error as Error).message || "Error setting new rates");
    }
  }

  return (
    <div className='w-full h-screen bg-[rgba(0,0,0,.8)] flex items-center justify-center z-20 absolute'>
      
      <div className="bg-white dark:bg-darkbg dark:text-darktext flex flex-col gap-4 p-4 rounded-2xl">
        <p className="text-xl text-primary">Set Default Rates</p>
        <form action="" className="flex flex-col items-center justify-center gap-4" onSubmit={(e) => {
          e.preventDefault();
          submitChangeRates();
        }}>
          <input type="number" className="form-input-bar" onChange={(e) => setNewRates(Number(e.target.value))} defaultValue={user.defaultrates}/>
          <button className="submit-btn">Set Default Rates</button>
        </form>
      </div>  

    </div>
  )
}

export default ChangeRates