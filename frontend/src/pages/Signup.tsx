import React from 'react'
import { Link } from 'react-router-dom';

const Signup = () => {

  
  return (
    <div className='w-full h-screen bg-white flex justify-center items-center gap-16'>
      
      <div className="w-96 h-96 flex flex-col justify-center items-center gap-4">
        <h1 className="text-primary text-5xl font-bold text-start w-full">Signup</h1>
        <form action="" className='w-full flex flex-col gap-4'>
          <input type="text" name="firstname" placeholder='First Name' 
            className='border-primary border-[1px] rounded-2xl text-zinc-700 w-full hover:shadow-lg focus:shadow-lg focus:outline-none' />
          <input type="text" name="lastname" placeholder='Last Name' 
            className='border-primary border-[1px] rounded-2xl text-zinc-700 w-full hover:shadow-lg focus:shadow-lg focus:outline-none' />
          <input type="text" name="email" placeholder='Email' 
            className='border-primary border-[1px] rounded-2xl text-zinc-700 w-full hover:shadow-lg focus:shadow-lg focus:outline-none' />
          <input type="text" name="password" placeholder='Password' 
            className='border-primary border-[1px] rounded-2xl text-zinc-700 w-full hover:shadow-lg focus:shadow-lg focus:outline-none' />
          <button className="bg-primary px-4 py-2 rounded-2xl text-white">Signup</button>
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