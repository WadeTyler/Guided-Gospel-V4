import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom';


/*
interface TogetherMessage {
    messageid: number;
    sessionid: string;
    userid: string;
    username: string;
    avatar: string;
    timestamp: string;
    text: string;
  }

*/

const Message = ({message}: {message: TogetherMessage}) => {
  const navigate = useNavigate();
  const {data:authUser} = useQuery<User>({ queryKey: ['authUser'] });
  const isSelf = message.userid === authUser?.userid;

  return (
    <div className={`flex gap-4 relative group-parent ${!isSelf ? 'self-start translate-x-16 lg:ml-10 flex-row-reverse' : 'self-end -translate-x-16 lg:mr-10'}`} >

      <div className="flex flex-col">
        <Link to={`/together/users/${message.username}`} className={`text-neutral-800 dark:text-darktext w-full hover:underline hover:text-primary ${isSelf ? 'text-end' : 'text-start'}`}>
          {message.username}
        </Link>
        <p className={`max-w-[40rem] w-fit p-3 text-gray-200 rounded-2xl ${!isSelf ? 'bg-neutral-800 dark:bg-darkaccent' : 'bg-zinc-500 dark:bg-neutral-600 self-end'}`}>
          {message.text}
        </p>
      </div>

      <img src={message.avatar ? `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_NAME}/image/upload/${message.avatar}` : "/images/default-avatar.jpg"} alt="User Avatar" className="rounded-full h-12 w-12 cursor-pointer" onClick={() => navigate(`/together/users/${message.username}`)} />
    </div>
  )
}

export default Message