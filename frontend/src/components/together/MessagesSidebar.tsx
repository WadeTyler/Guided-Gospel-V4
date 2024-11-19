import { useQuery, useQueryClient } from '@tanstack/react-query';
import { SetStateAction, useEffect, useState } from 'react'
import toast from 'react-hot-toast';


const MessagesSidebar = ({currentSession, setCurrentSession}: 
  {currentSession: string; setCurrentSession: React.Dispatch<SetStateAction<string>>; }
) => {

  // Handle message notifications
  const { data:notifications } = useQuery<NotificationType[]>({ queryKey: ['notifications'] });
  const [unseenMessages, setUnseenMessages] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    const newUnseenMessages = new Map<string, number>();

    notifications?.forEach((notification) => {
      if (notification.type === "message" && notification.seen === 0) {
        const currentCount = newUnseenMessages.get(notification.senderid) || 0;
        newUnseenMessages.set(notification.senderid, currentCount + 1);
      }
    });
    setUnseenMessages(newUnseenMessages);
    console.log(newUnseenMessages);
  }, [notifications]);


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
  }, [authUser]);

  return (
    <div className='fixed flex flex-col p-4 bg-neutral-800 dark:bg-darkaccent w-48 min-h-screen right-0 top-0 gap-8 z-50 shadow-[rgba(0,0,0)_0px_2px_8px]'>
      <h2 className="text-primary font-bold text-xl text-center mt-1">Messages</h2>

      <div className="flex flex-col w-full h-full text-darktext gap-4">
        {messageSessions && !loadingSessions && messageSessions.map((session: MessageSession) => (

          <div 
          onClick={() => {
            setCurrentSession(session.sessionid);
          }}
          className="flex gap-2 w-full overflow-hidden group-parent hover:translate-x-2 cursor-pointer duration-300" key={session.sessionid}>
            {/* If we are user 1, show user 2 */}
            {session.user1 === authUser?.userid && 
              <section className="flex gap-2">

                <div className="relative flex items-center justify-center rounded-full w-10 h-10 shrink-0">
                  <img src={session.user2_avatar ? `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_NAME}/image/upload/${session.user2_avatar}` : "/images/default-avatar.jpg"} alt="User Avatar" className="rounded-full cursor-pointer h-10 w-10 object-cover" />

                  {unseenMessages.get(session.user2) && 
                    <div className="absolute bottom-0 right-0 w-4 h-4 p-2 bg-primary rounded-full flex items-center justify-center">
                      <p className="text-white">{unseenMessages.get(session.user2)}</p>
                    </div>
                  }
                </div>

                <div className="flex flex-col gap-1 overflow-hidden">
                  <p className={`${currentSession === session.sessionid ? 'text-primary' : ''} duration-300 group-parent-hover:text-primary`}>{session.user2_username}</p>
                  <p className={`${currentSession === session.sessionid ? 'text-primary' : 'text-gray-400'} text-xs whitespace-nowrap italic group-parent-hover:text-primary duration-300`}>
                    {session.lastMessage}
                  </p>
                </div>
              </section>
            }
            {/* If we are user2 show user 1 */}
            {session.user2 === authUser?.userid && 
              <section className="flex gap-2">
                <div className="relative flex items-center justify-center rounded-full w-10 h-10 shrink-0">
                  <img src={session.user1_avatar ? `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_NAME}/image/upload/${session.user1_avatar}` : "/images/default-avatar.jpg"} alt="User Avatar" className="rounded-full cursor-pointer h-10 w-10 object-cover" />

                  {unseenMessages.get(session.user1) && 
                    <div className="absolute bottom-0 right-0 w-4 h-4 p-2 bg-primary rounded-full flex items-center justify-center">
                      <p className="text-white">{unseenMessages.get(session.user1)}</p>
                    </div>
                  }
                </div>

                <div className="flex flex-col gap-1 w-full overflow-hidden">
                  <p className={`${currentSession === session.sessionid ? 'text-primary' : ''} duration-300 group-parent-hover:text-primary`}>{session.user1_username}</p>
                  <p className={`${currentSession === session.sessionid ? 'text-primary' : 'text-gray-400'} text-xs whitespace-nowrap italic duration-300 group-parent-hover:text-primary`}>
                    {session.lastMessage}
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