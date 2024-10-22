
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { RiChatNewFill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { convertToDateUSFormat } from '../../lib/utils';
import toast from 'react-hot-toast';
import Loading from '../Loading';
import { FaDeleteLeft } from "react-icons/fa6";


const Sidebar = ({currentSessionid, setCurrentSessionid}: {currentSessionid: string; setCurrentSessionid: React.Dispatch<React.SetStateAction<string>>;}) => {

  const { data:authUser } = useQuery({ queryKey: ['authUser'] });
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

  const handleDeleteSession = (sessionid: string) => {
    if (!sessionid) {
      return;
    }
    deleteSession(sessionid);
  }


  return (
    <div className='bg-neutral-800 w-48 h-full flex flex-col shadow-[rgba(0,0,0)_0px_2px_8px] gap-8 px-3 py-3 absolute z-10 pb-12'>

      <Link to="/" className="text-primary font-bold text-2xl mt-1 cursor-pointer hover:translate-y-1 transition-all duration-300 ease-in-out">Guided Gospel</Link>

      <section className="text-white flex flex-row gap-2 items-center text-lg cursor-pointer hover:translate-y-2 transition-all duration-300 ease-in-out"
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
              <section className="group-hover:scale-90 transition-all duration-300 ease-in-out">
                <p className="text-xs">{convertToDateUSFormat(session.lastmodified)}</p>
                <p className=''>
                  {"Placeholder summary"}
                </p>
              </section>
              <div className="absolute right-0 top-0 hover:text-red-500" onClick={(e) => {
                e.stopPropagation();
                handleDeleteSession(session.sessionid);
              }}>
                <FaDeleteLeft />
              </div>
            </div>
          ))
        }
      </section>

      
      {isDeletingAll &&
        <div className="flex gap-2 items-center absolute bottom-16">
          <button className='text-white px-2 py-1 rounded-xl bg-red-700' onClick={() => handleDeleteAllButton()}>Confirm</button>
          <button className='text-neutral-800 px-2 py-1 rounded-xl bg-primary' onClick={() => setIsDeletingAll(false)}>Cancel</button>
        </div>
      }

      {!deletingAllSessions && 
        <section className="text-red-500 flex flex-row gap-2 items-center text-lg cursor-pointer hover:translate-y-2 transition-all duration-300 ease-in-out absolute bottom-4" onClick={() => setIsDeletingAll(true)}>
          <MdDelete />
          <p>Delete All</p>
        </section>
      }
      {deletingAllSessions && <Loading size="md" cn="text-red-500 flex flex-row gap-2 items-center text-lg  absolute bottom-4" />}

    </div>
  )
}

export default Sidebar