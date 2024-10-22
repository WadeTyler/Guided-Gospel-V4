import { useState, useEffect } from 'react';
import Sidebar from '../components/chat/Sidebar';
import Messages from '../components/chat/Messages';
import Loading from '../components/Loading';

import { FaArrowAltCircleUp } from "react-icons/fa";
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const Chat = () => {
  const queryClient = useQueryClient();

  const { data:authUser } = useQuery({ queryKey: ['authUser'] });

  const [currentSessionid, setCurrentSessionid] = useState<string>('');
  const [inputMessage, setInputMessage] = useState<string>('');

  const { data:messages } = useQuery({
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
        console.log(data);
        return data;
      } catch (error) {
        throw new Error((error as Error).message);
      }
    }
  })

  const { mutate:sendMessage, isPending:sendingMessage, error } = useMutation({
    mutationFn: async (inputMessage: string) => {
      try {
        var sessionid = currentSessionid;
        // Create a new session if there is no current session
        if (!sessionid) {
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

        // Add the user message
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

        // Invalidate the messages query to show the user message
        queryClient.invalidateQueries({queryKey: ['messages']});
        setInputMessage('');  // Reset Input Message

        // Get AI Response
        const aiResponse = await fetch('/api/ai/completion', {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({message: inputMessage})
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

        // Reset Input Message
        setInputMessage('');

      } catch (error) {
        throw new Error((error as Error).message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['messages']});
      queryClient.invalidateQueries({queryKey: ['sessionData']});
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  })

  useEffect(() => {
    console.log(currentSessionid);
    queryClient.invalidateQueries({queryKey: ['messages']});
  }, [currentSessionid]);


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

  return (
    <div className="w-full h-screen flex relative">
      <Sidebar currentSessionid={currentSessionid} setCurrentSessionid={setCurrentSessionid}  />

      <div className="w-full h-screen relative flex flex-col items-center">

        {
          currentSessionid &&
          <Messages messages={messages} />
        }

        {
          !currentSessionid &&
          <div className="w-full h-full flex flex-col items-center justify-center">
            <p className="">Ask away!</p>
            <p className="">Some things you can ask me... placeholder</p>
            <p>.....</p>
          </div>
        }

        <form action="" 
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className='absolute bottom-24 flex items-center justify-center bg-neutral-800 w-[40rem] rounded-xl'>
          <input type="text" name="inputMessage" onChange={(e) => setInputMessage(e.target.value)} value={inputMessage}
            className={`w-full h-12 bg-transparent border-none rounded-xl focus:outline-none focus:border-none focus:ring-0 placeholder:text-zinc-500 ${sendingMessage ? 'text-zinc-500' : 'text-white'}`}
            placeholder='Ask me anything...'
            disabled={sendingMessage}
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