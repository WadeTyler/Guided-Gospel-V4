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

const Chat = () => {
  const queryClient = useQueryClient();
  interface AuthUser {
    firstname: string;
    lastname: string;
    age: number;
    denomination: string;
    email: string;
  }

  const { data:authUser } = useQuery<AuthUser>({queryKey: ['authUser']});

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
    console.log(inputMessage);

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

  return (
    <div className="w-full h-screen flex relative">
      <Sidebar currentSessionid={currentSessionid} setCurrentSessionid={setCurrentSessionid}  />

      <div className="w-full h-screen relative flex flex-col items-center">

        {
          currentSessionid && !refetchingMessages &&
          <Messages messages={messages} />
        }
        {
          refetchingMessages && 
          <div className="w-full h-full flex justify-center items-center">

              <Loading cn="text-primary" size="lg"/>
          </div>
        }
        {
          !currentSessionid &&
          <div className="w-full h-full flex flex-col justify-center items-center gap-6">


            {authUser && 
              <motion.h2 
              initial={{ x: 100, opacity: 0}}
              animate={{ x: 0, opacity: 1}}
              transition={{ duration: .5}}
              className="text-5xl w-[40rem] text-end text-primary">
                {`Hey ${formatName(authUser.firstname)}!`}
              </motion.h2>
            }

            <motion.div 
              initial={{ x: -100, opacity: 0}}
              animate={{ x: 0, opacity: 1}}
              transition={{ duration: .5}}
            className="w-[40rem]">
              <h3 className="text-3xl">Verse of the Day</h3>
              {!votdPending && votd && 
                <div className="">
                  <p className="text-lg italic">"{votd.verse}"</p>
                  <p className="text-sm">{votd.location}</p>
                </div>
              }
              {votdPending && 
                <Loading cn="text-primary" size="md"/>
              }
              {
                votdError && 
                <p className="text-lg">Sorry... something went wrong. No verse today 🥺</p>
              }
              
            </motion.div>

            <motion.section className="w-[40rem]"
            initial={{ x: -100, opacity: 0}}
            animate={{ x: 0, opacity: 1}}
            transition={{ duration: .5}} 
            >
              <div className="flex text-3xl">
                <p className="">Ask me about </p>
                <FlipWords words={words} />
              </div>
              <p className="">
                Guided Gospel is your spiritual companion. You choose how you want to be guided! Have a question about a bible verse? Or maybe you want to learn more about something you heard? Whatever it is, ask away!
              </p>
            </motion.section>
            
            
          </div>
        }

        <form action="" 
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className='absolute bottom-24 flex items-center justify-center bg-neutral-800 w-[40rem] rounded-xl hover:shadow-md hover:shadow-black focus-within:shadow-md focus-within:shadow-black transition-all duration-300 ease-in-out'>
          <input type="text" name="inputMessage" onChange={(e) => setInputMessage(e.target.value)} value={inputMessage}
            className={`w-full h-12 bg-transparent border-none rounded-xl focus:outline-none focus:border-none focus:ring-0 placeholder:text-zinc-500 group ${sendingMessage ? 'text-zinc-500 cursor-not-allowed' : 'text-white'}`}
            placeholder='Message Guided'
            disabled={sendingMessage || refetchingMessages}
          />
          {!sendingMessage && 
            <button 
              className="h-12 w-12 flex items-center justify-center text-3xl text-primary hover:text-white ease-in-out duration-300 transition-all"
            >
              <FaArrowAltCircleUp />
            </button>
          }
          {sendingMessage &&
            <Loading cn="h-12 w-12 flex items-center justify-center text-primary" size="sm" />
          }
          
        </form>
      </div>
    </div>
  )
}

export default Chat