import { useState, useEffect } from 'react';
import Sidebar from '../components/chat/Sidebar';
import Messages from '../components/chat/Messages';
import Loading from '../components/Loading';
import { FlipWords } from '../components/flip-words';

import { FaArrowAltCircleUp } from "react-icons/fa";
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { formatName } from '../lib/utils';

import { motion } from 'framer-motion';
import BackgroundPattern from '../components/BackgroundPattern';


const Chat = () => {
  const queryClient = useQueryClient();

  const { data:authUser } = useQuery<User>({queryKey: ['authUser']});

  const { data:votd, isPending:votdPending, error:votdError } = useQuery({
    queryKey: ['votd'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/verse/votd', {
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

  const [currentSessionid, setCurrentSessionid] = useState<string>('');
  const [inputMessage, setInputMessage] = useState<string>('');


  type Message = {
    messageid?: string;
    sessionid?: string;
    userid?: string;
    timestamp: string;
    sender: string;
    text: string
  }

  const loadingMessage: Message = {
    timestamp: new Date().toISOString(),
    sender: 'ai',
    text: '...'
  } 

  const [messages, setMessages] = useState<Message[]>([]);

  const { data:messagesData, isRefetching:refetchingMessages } = useQuery({
    queryKey: ['messages'],
    queryFn: async () => {
      try {

        if (!currentSessionid) {
          return [];
        }

        const response = await fetch(`/api/message/${currentSessionid}`, {
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

  const { mutate:sendMessage, isPending:sendingMessage } = useMutation({
    mutationFn: async (inputMessage: string) => {
      try {
        var sessionid = currentSessionid;
        var firstMessage = false;
        // Create a new session if there is no current session
        if (!sessionid) {
          firstMessage = true;
          const response = await fetch('/api/session/create', {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.message);
          }
          setCurrentSessionid(data.sessionid);
          sessionid = data.sessionid;
        }

        // Add the user message to the database
        const userResponse = await fetch('/api/message/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionid: sessionid,
            sender: 'user',
            text: inputMessage,
          })
        });

        const userData = await userResponse.json();
        if (!userResponse.ok) {
          throw new Error(userData.message);
        }
        
        // Add the message to the messages array
        setMessages(prevMessages => [...prevMessages, userData])  
        setInputMessage('');  // Reset Input Message

        // Add AI Loading Message
        setMessages(prevMessages => [...prevMessages, loadingMessage]);

        // Get AI Response
        const aiResponse = await fetch('/api/ai/completion', {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({message: inputMessage, sessionid, firstname: authUser?.firstname, age: authUser?.age, denomination: authUser?.denomination})
        });
        const aiData = await aiResponse.json();
        if (!aiResponse.ok) {
          // Remove AI Loading Message
          setMessages(prevMessages => prevMessages.slice(0, -1));
          throw new Error(aiData.message);
        }
        const content = aiData.content;

        // Add the AI response
        const addAiMessageResponse = await fetch('/api/message/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionid: sessionid,
            sender: 'ai',
            text: content,
          })
        });
        const aiMessageData = await addAiMessageResponse.json();
        if (!addAiMessageResponse.ok) {
          throw new Error(aiMessageData.message);
        }

        // Remove AI Loading Message
        setMessages(prevMessages => prevMessages.slice(0, -1));

        // Add the message to the messages array
        setMessages(prevMessages => [...prevMessages, aiMessageData])   

        // Create the summary of the session
        if (firstMessage) {
          const summaryResponse = await fetch(`/api/ai/summary`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({sessionid})
          });
          const summaryData = await summaryResponse.json();
          if (!summaryResponse.ok) {
            throw new Error(summaryData.message);
          }
        }

      } catch (error) {
        throw new Error((error as Error).message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['sessionData']});
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  })

  useEffect(() => {

    // Reload messages on sessionid change
    const fetchData = async () => {
      console.log(currentSessionid);
      await queryClient.invalidateQueries({queryKey: ['messages']});
    };
    fetchData();

    // Reset the input message on sessionid change
    setInputMessage('');
  }, [currentSessionid]);

  useEffect(() => {
    if (messagesData) {
      setMessages(messagesData);
    }
  }, [messagesData])

  const handleSubmit = () => {

    if (authUser?.suspended) {
      toast.error("You have been suspended from using this service. Please contact support if you believe this is an error.");
      return;
    }

    // Check if the input message is empty
    if (!inputMessage) {
      toast.error('Please enter a message');
      return;
    }

    // Check if sending message
    if (sendingMessage) {
      toast.error('Please wait for the previous message to send');
      return;
    }
    sendMessage(inputMessage);
  }

  const words = [
    "The Bible",
    "Jesus",
    "God",
    "Faith",
    "Christianity",
    "Salvation",
    "Prayer",
    "The Holy Spirit",
  ]
  
  // Handle screensize
  const [screenLg, setScreenLg] = useState<Boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setScreenLg(window.innerWidth > 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full h-screen flex flex-col relative group bg-white dark:bg-darkbg">
  
      <BackgroundPattern cn="" />
  
      {/* Sidebar */}
      <Sidebar currentSessionid={currentSessionid} setCurrentSessionid={setCurrentSessionid} />
  
      <div className="w-full h-full relative flex flex-col items-center px-4 sm:px-8">
  
        {/* Messages Section */}
        {currentSessionid && !refetchingMessages && <Messages messages={messages} />}
  
        {/* Loading Indicator */}
        {refetchingMessages && (
          <div className="w-full h-full flex justify-center items-center">
            <Loading cn="text-primary" size="lg" />
          </div>
        )}
  
        {/* Initial Section */}
        {!currentSessionid && (
          <div className="w-full h-full flex flex-col justify-center items-center gap-6">
  
            {/* Greeting */}
            {authUser && (
              <motion.h2
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-3xl sm:text-5xl w-full sm:w-[40rem] text-end sm:text-end text-primary">
                {`Hey ${formatName(authUser.firstname)}!`}
              </motion.h2>
            )}
  
            {/* Verse of the Day */}
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full sm:w-[40rem] sm:text-start">
              <h3 className="text-2xl sm:text-3xl dark:text-white">Verse of the Day</h3>
              {!votdPending && votd && (
                <div>
                  <p className="text-base sm:text-lg italic dark:text-darktext">"{votd.verse}"</p>
                  <p className="text-xs sm:text-sm dark:text-darktext">{votd.location}</p>
                </div>
              )}
              {votdPending && <Loading cn="text-primary" size="md" />}
              {votdError && <p className="text-base sm:text-lg dark:text-darktext">Sorry... something went wrong. No verse today 🥺</p>}
            </motion.div>
  
            {/* Info Section */}
            <motion.section
              className="w-full sm:w-[40rem] sm:text-start"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}>
              <div className="flex sm:justify-start text-xl sm:text-3xl">
                <p className="dark:text-white">Ask me about </p>
                <FlipWords words={words} />
              </div>
              <p className="dark:text-darktext">
                Guided Gospel is your spiritual companion. You choose how you want to be guided! Have a question about a bible verse? Or maybe you want to learn more about something you heard? Whatever it is, ask away!
              </p>
            </motion.section>
          </div>
        )}
  
        {/* Input Form */}
        <form
          action=""
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="absolute bottom-20 sm:bottom-24 flex items-center justify-center bg-neutral-800 dark:bg-darktext w-11/12 sm:w-[40rem] rounded-xl px-4 sm:px-0 hover:shadow-md hover:shadow-black focus-within:shadow-md focus-within:shadow-black transition-all duration-300 ease-in-out">
          <input
            type="text"
            name="inputMessage"
            onChange={(e) => setInputMessage(e.target.value)}
            value={inputMessage}
            className={`w-full h-10 sm:h-12 bg-transparent border-none rounded-xl focus:outline-none focus:border-none focus:ring-0 placeholder:text-zinc-500 group ${sendingMessage ? 'text-zinc-500 cursor-not-allowed' : 'text-white dark:text-neutral-800'}`}
            placeholder="Message Guided"
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
    </div>
  );
  
}


export default Chat