import React from 'react'

interface User  {
  userid: string;
  firstname: string;
  lastname: string;
  email: string;
  age?: number;
  denomination?: string;
  rates: number;
  createdat: string;
}

const UserRow = ({user}: {user:User}) => {
  return (
    <div className='w-full bg-zinc-600 text-white flex gap-4'>
      <p className="">{user.firstname}</p>
      <p className="">{user.lastname}</p>
      <p className="">{user.email}</p>
      <p className="">{user.age}</p>
      <p className="">{user.denomination}</p>
      <p className="">{user.rates}</p>
      <p className="">{user.createdat}</p>
    </div>
  )
}

export default UserRow