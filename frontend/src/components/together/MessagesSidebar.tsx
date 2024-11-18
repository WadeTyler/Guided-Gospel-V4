import { useQuery, useQueryClient } from '@tanstack/react-query';
import { SetStateAction, useEffect, useState } from 'react'
import toast from 'react-hot-toast';


type MessageSession = {
  sessionid: string; // jwt
  user1: string; // userid
  user2: string; // userid
  lastModified: string; // timestamp

  // extra when fetched
  user1_username: string;
  user1_avatar: string;
  user2_username: string;
  user2_avatar: string;
  lastMessage: string;
}

const MessagesSidebar = ({currentSession, setCurrentSession}: 
  {currentSession: string; setCurrentSession: React.Dispatch<SetStateAction<string>>; }
) => {


  const queryClient = useQueryClient();
  const {data:authUser} = useQuery<User>({ queryKey: ['authUser'] });
  
  // query for user sessions
  const {data:messageSessions, isPending:loadingSessions} = useQuery<MessageSession[]>({
    queryKey: ['messageSessions'],
    queryFn: async () => {
      try {
        const response = await fetch("/api/together/messages/sessions/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.message);
        console.log(data);
        return data;
      } catch (error) {
        toast.error((error as Error).message || "Something went wrong");
      }
    }
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['messageSessions']});
  }, []);

  return (
    <div className='fixed flex flex-col p-4 bg-neutral-800 dark:bg-darkaccent w-48 min-h-screen right-0 top-0 gap-8 z-50 shadow-[rgba(0,0,0)_0px_2px_8px]'>
      <h2 className="text-primary font-bold text-xl text-center mt-1">Messages</h2>

      <div className="flex flex-col w-full h-full text-darktext gap-4">
        {messageSessions && !loadingSessions && messageSessions.map((session: MessageSession) => (

          <div 
          onClick={() => {
            setCurrentSession(session.sessionid);
          }}
          className="flex gap-2 w-full overflow-hidden group hover:translate-x-2 cursor-pointer duration-300" key={session.sessionid}>
            {/* If we are user 1, show user 2 */}
            {session.user1 === authUser?.userid && 
              <section className="flex gap-2">

                <img src={session.user2_avatar ? `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_NAME}/image/upload/${session.user2_avatar}` : "/images/default-avatar.jpg"} alt="User Avatar" className="rounded-full h-10 w-10 cursor-pointer" />

                <div className="flex flex-col gap-1 overflow-hidden">
                  <p className={`${currentSession === session.sessionid ? 'text-primary' : ''} duration-300 group-hover:text-primary`}>{session.user2_username}</p>
                  <p className={`${currentSession === session.sessionid ? 'text-primary' : 'text-gray-400'} text-xs whitespace-nowrap italic group-hover:text-primary duration-300`}>
                    Lorem ipsum...
                  </p>
                </div>
              </section>
            }
            {/* If we are user2 show user 1 */}
            {session.user2 === authUser?.userid && 
              <section className="flex gap-2">

                <img src={session.user1_avatar ? `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_NAME}/image/upload/${session.user1_avatar}` : "/images/default-avatar.jpg"} alt="User Avatar" className="rounded-full h-10 w-10 cursor-pointer" />

                <div className="flex flex-col gap-1 w-full overflow-hidden">
                  <p className={`${currentSession === session.sessionid ? 'text-primary' : ''} duration-300 group-hover:text-primary`}>{session.user1_username}</p>
                  <p className={`${currentSession === session.sessionid ? 'text-primary' : 'text-gray-400'} text-xs whitespace-nowrap italic duration-300 group-hover:text-primary`}>
                    Lorem ipsum...f f dsa f sadf sad f
                  </p>
                </div>
              </section>
            }
          </div>

        ))}
        {!messageSessions && !loadingSessions && <p>You have no messages</p>}
      </div>

    </div>
  )
}

export default MessagesSidebar