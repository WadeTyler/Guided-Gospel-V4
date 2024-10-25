
import { useState } from 'react';

import { RiChatNewFill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { convertToDateUSFormat } from '../../lib/utils';
import toast from 'react-hot-toast';
import Loading from '../Loading';
import { FaDeleteLeft } from "react-icons/fa6";


const Sidebar = ({currentSessionid, setCurrentSessionid}: {currentSessionid: string; setCurrentSessionid: React.Dispatch<React.SetStateAction<string>>;}) => {

  const queryClient = useQueryClient();

  type SessionData = {
    sessionid: string;
    userid: string;
    summary: string | null;
    lastmodified: string;
  }[]
  
  const { data:sessionData } = useQuery<SessionData>({
    queryKey: ['sessionData'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/session', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message);
        }
        console.log(data);
        return data;
      } catch (error) {
        throw new Error((error as Error).message);
      }
    }
  })

  const [isDeletingAll, setIsDeletingAll] = useState<boolean>(false);

  const { mutate:deleteAllSessions, isPending:deletingAllSessions } = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/session', {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      
    },
    onSuccess: () => {
      toast.success('All sessions deleted');
      queryClient.invalidateQueries({ queryKey: ['sessionData']});
      queryClient.invalidateQueries({ queryKey: ['messages']});
      setCurrentSessionid('');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  const handleDeleteAllButton = () => {
    if (!isDeletingAll) {
      return;
    }
    if (!sessionData || sessionData.length === 0) {
      setIsDeletingAll(false);
      toast.error("No sessions to delete");
      return;
    }
    deleteAllSessions();
    setIsDeletingAll(false);

    
  }

  const { mutate:deleteSession, isPending:deletingSession } = useMutation({
    mutationFn: async (sessionid:string) => {
      try {
        const response = await fetch(`/api/session/${sessionid}`, {
          method: "DELETE",
          headers: {
            'Content-Type': 'application/json',
          }
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message);
        }

        if (currentSessionid === sessionid) {
          setCurrentSessionid('');
        }

      } catch (error) {
        throw new Error((error as Error).message);
      }
    },
    onSuccess: () => {
      toast.success("Session deleted");
      queryClient.invalidateQueries({ queryKey: ['sessionData']});

    },
    onError: (error: Error) => {
      toast.error(error.message || "Something went wrong");
    }
  })

  const [currentDeleteSession, setCurrentDeleteSession] = useState<string>('');
  const [isDeletingSession, setIsDeletingSession] = useState<boolean>(false);

  const handleDeleteSession = (sessionid: string) => {
    if (!sessionid) {
      return;
    }
    deleteSession(sessionid);
    setIsDeletingSession(false);
  }


  return (
    <div className='bg-neutral-800 dark:bg-darkaccent w-48 h-full flex flex-col shadow-[rgba(0,0,0)_0px_2px_8px] gap-8 px-3 py-3 absolute z-10 pb-12'>

      
      <h2 className="text-primary font-bold text-2xl mt-1 ">Guided Gospel</h2>

      <section className="text-white flex flex-row gap-2 items-center text-lg cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
      onClick={() => setCurrentSessionid('')}
      >
        <RiChatNewFill />
        <p>New Chat</p>
      </section>

      <section className="flex flex-col gap-4 justify-center overflow-auto">
        {sessionData && 
          sessionData.map((session) => (
            <div 
              className={`relative pb-4 border-b-[1px] border-b-primary last-of-type:border-none group cursor-pointer ${currentSessionid === session.sessionid ? 'text-primary' : 'text-white'}`} 
              key={session.sessionid} // Better to use a unique identifier
              onClick={() => setCurrentSessionid(session.sessionid)}
            >
              <section className="group-hover:scale-95 transition-all duration-300 ease-in-out">
                <p className="text-xs">{convertToDateUSFormat(session.lastmodified)}</p>
                <p className='text-sm'>
                  {session.summary || 'No Summary'}
                </p>
              </section>
              {!deletingSession && 
                <div className="absolute right-0 top-0 hover:text-red-500" onClick={(e) => {
                  e.stopPropagation();
                  setCurrentDeleteSession(session.sessionid);
                  setIsDeletingSession(true);
                }}>
                  <FaDeleteLeft />
                </div>
              }
              {deletingSession && <Loading size="sm" cn="absolute right-0 top-0 text-red-500" />}
            </div>
          ))
        }
      </section>

      {!deletingAllSessions && 
        <section className="text-red-500 flex flex-row gap-2 items-center text-lg cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out absolute bottom-4" onClick={() => setIsDeletingAll(true)}>
          <MdDelete />
          <p>Delete All</p>
        </section>
      }
      {deletingAllSessions && <Loading size="md" cn="text-red-500 flex flex-row gap-2 items-center text-lg  absolute bottom-4" />}

      {isDeletingAll && <div className="absolute top-0 left-0 w-screen h-screen bg-[rgba(0,0,0,.8)] z-50 flex items-center justify-center">
        <div className="bg-white dark:bg-darkbg rounded-2xl p-4 flex flex-col items-center justify-center gap-2">
          <p className="text-3xl text-primary">Confirm Delete All Sessions</p>
          <p className="dark:text-darktext">Are you sure you want to delete all chat sessions?<br/>Once you do so, all previous messages will be lost.</p>
          <section className="flex gap-4 items-center justify-center">
            <button className="delete-btn" onClick={() => {
              handleDeleteAllButton();
            }}>Confirm Delete All</button>
            <button className="submit-btn" onClick={() => {
              setIsDeletingAll(false);
            }}>Cancel</button>
          </section>
        </div>
      </div> }

      {isDeletingSession && 
      <div className="absolute top-0 left-0 w-screen h-screen bg-[rgba(0,0,0,.8)] z-50 flex items-center justify-center">
        <div className="bg-white dark:bg-darkbg rounded-2xl p-4 flex flex-col items-center justify-center gap-2">
          <p className="text-3xl text-primary">Confirm Delete Session</p>
          <p className="dark:text-darktext">Are you sure you want to delete this session?<br/>Once you do so, all messages in the chat session will be lost.</p>
          <section className="flex gap-4 items-center justify-center">
            <button className="delete-btn" onClick={() => {
              handleDeleteSession(currentDeleteSession);
            }}>Confirm Delete</button>
            <button className="submit-btn" onClick={() => {
              setIsDeletingSession(false);
            }}>Cancel</button>
          </section>
        </div>
      </div> }

    </div>
  )
}

export default Sidebar