import { useEffect, useState } from "react"
import MessagesSidebar from "../../components/together/MessagesSidebar"
import Sidebar from "../../components/together/Sidebar"
import { FaArrowAltCircleUp } from "react-icons/fa";
import Loading from "../../components/Loading";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Message from "../../components/together/Message";
import { socket } from '../../App';

const Messages = () => {

  const queryClient = useQueryClient();
  const {data: authUser} = useQuery<User>({ queryKey: ['authUser'] });

  const [inputMessage, setInputMessage] = useState<string>('');
  const sendingMessage = false;
  const refetchingMessages = false;

  const [currentSession, setCurrentSession] = useState<string>('');

  const [messages, setMessages] = useState<TogetherMessage[]>([]);

  const { data:messagesData, isPending:loadingMessages } = useQuery<TogetherMessage[]>({
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
        return data;

      } catch (error) {
        console.log("Error fetching together_messages: ", error);
        throw new Error((error as Error).message);
      }
    }
  });

  useEffect(() => {
    if (messagesData) {
      setMessages(messagesData);
    }
    else {
      setMessages([]);
    }
  }, [messagesData]);



  // Handle session change
  useEffect(() => {
    const outputJoin = (content: string) => {
      console.log(content);
    }
    // Join room on session change
    if (currentSession) {
      socket.emit("join-room", currentSession, outputJoin);
    }
  
  }, [currentSession]);


  useEffect(() => {
    socket.on("receive-message", async (message) => {
      console.log(message);
      setMessages(prev => [...prev, message]);
    })
  }, [])

  // Send new Message
  const sendMessage = () => {
    try {
      if (inputMessage) {
        console.log("Sending message");
        socket.emit("private-message", currentSession, authUser?.userid, currentSession, inputMessage);

        setInputMessage('');
      }
    } catch (error) {
      console.log("Error sending message: ", error);
    }
  }

  useEffect(() => {
    setMessages([]);
    queryClient.invalidateQueries({ queryKey: ['together_messages']} );
  }, [currentSession]);

  return (
    <div className='flex justify-center bg-white dark:bg-darkbg h-screen'>
      <Sidebar />

      <div className="w-full items-center mt-24 flex flex-col gap-4 dark:text-darktext">


        <div className="flex flex-col w-full h-full lg:px-48 pt-16 lg:pb-16 mb-36 relative overflow-scroll gap-4">
          {currentSession && !loadingMessages && messages?.map((message) => (
            <Message message={message} key={message.messageid} />
          ))}
          {loadingMessages && <Loading cn="text-primary" size="md" />}

        </div>
        
        {/* Input Form */}
        {currentSession && 
          <form
            action=""
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
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
        }

      </div>

      <MessagesSidebar currentSession={currentSession} setCurrentSession={setCurrentSession} />
    </div>
  )
}

export default Messages