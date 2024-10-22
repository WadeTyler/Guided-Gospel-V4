
import { Link } from 'react-router-dom';
import { RiChatNewFill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import { useQuery, useMutation } from '@tanstack/react-query';
import { convertToDateUSFormat } from '../../lib/utils';


const Sidebar = ({currentSessionid, setCurrentSessionid}: {currentSessionid: string; setCurrentSessionid: React.Dispatch<React.SetStateAction<string>>;}) => {

  const { data:authUser } = useQuery({ queryKey: ['authUser'] });

  type SessionData = {
    sessionid: string;
    userid: string;
    summary: string | null;
    lastmodified: string;
  }
  
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
        return data;
      } catch (error) {
        throw new Error((error as Error).message);
      }
    }
  })


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
              className={`pb-4 border-b-[1px] border-b-primary last-of-type:border-none group cursor-pointer ${currentSessionid === session.sessionid ? 'text-primary' : 'text-white'}`} 
              key={session.sessionid} // Better to use a unique identifier
              onClick={() => setCurrentSessionid(session.sessionid)}
            >
              <p className="text-xs">{convertToDateUSFormat(session.lastmodified)}</p>
              <p className='text-lg transition-all duration-300 ease-in-out group-hover:translate-y-2'>
                {"Placeholder summary"}
              </p>
            </div>
          ))
        }
      </section>


      <section className="text-red-700 flex flex-row gap-2 items-center text-lg cursor-pointer hover:translate-y-2 transition-all duration-300 ease-in-out absolute bottom-4">
        <MdDelete />
        <p>Delete All</p>
      </section>
      

    </div>
  )
}

export default Sidebar