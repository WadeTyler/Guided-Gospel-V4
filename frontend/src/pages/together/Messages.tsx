import { useEffect, useState } from "react"
import MessagesSidebar from "../../components/together/MessagesSidebar"
import Sidebar from "../../components/together/Sidebar"
import { FaArrowAltCircleUp } from "react-icons/fa";
import Loading from "../../components/Loading";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Message from "../../components/together/Message";


const Messages = () => {

  const queryClient = useQueryClient();

  const [inputMessage, setInputMessage] = useState<string>('');
  const sendingMessage = false;
  const refetchingMessages = false;

  const [currentSession, setCurrentSession] = useState<string>('');

  const { data:messages, isPending:loadingMessages } = useQuery<TogetherMessage[]>({
    queryKey: ['together_messages'],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/together/messages/all/${currentSession}`, {
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
        console.log("Error fetching together_messages: ", error);
        throw new Error((error as Error).message);
      }
    }
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['together_messages']} );
  }, [currentSession]);

  return (
    <div className='flex justify-center bg-white dark:bg-darkbg min-h-screen'>
      <Sidebar />

      <div className="w-full items-center mt-24 flex flex-col gap-4 dark:text-darktext">


        <div className="flex flex-col w-full h-full lg:px-48 pt-16 lg:pb-16 mb-36 relative overflow-auto gap-4">
          {messages?.map((message) => (
            <Message message={message} key={message.messageid} />
          ))}
        </div>
        


        {/* Input Form */}
        <form
          action=""
          onSubmit={(e) => {
            e.preventDefault();
            // handleSubmit();
          }}
          className="absolute bottom-20 sm:bottom-24 flex items-center justify-center bg-neutral-800 dark:bg-darktext w-11/12 sm:w-[40rem] rounded-xl px-4 sm:px-0 hover:shadow-md hover:shadow-black focus-within:shadow-md focus-within:shadow-black transition-all duration-300 ease-in-out">
          <input
            type="text"
            name="inputMessage"
            onChange={(e) => setInputMessage(e.target.value)}
            value={inputMessage}
            className={`w-full h-10 sm:h-12 bg-transparent border-none rounded-xl focus:outline-none focus:border-none focus:ring-0 placeholder:text-zinc-500 group ${sendingMessage ? 'text-zinc-500 cursor-not-allowed' : 'text-white dark:text-neutral-800'}`}
            placeholder={`Message Username`}
            disabled={sendingMessage || refetchingMessages}
          />
          {!sendingMessage && (
            <button
              className="h-10 sm:h-12 w-10 sm:w-12 flex items-center justify-center text-2xl sm:text-3xl text-primary hover:text-white dark:hover:text-darkaccent ease-in-out duration-300 transition-all">
              <FaArrowAltCircleUp />
            </button>
          )}
          {sendingMessage && <Loading cn="h-10 sm:h-12 flex items-center justify-center text-primary" size="sm" />}
        </form>

      </div>

      <MessagesSidebar currentSession={currentSession} setCurrentSession={setCurrentSession} />
    </div>
  )
}

export default Messages