
import { useEffect } from 'react';
import {Message as MessageType} from '../../types/message.types.ts';
import Message from './Message.tsx';

const Messages = ({messages}: {
  messages: MessageType[];
}) => {

  useEffect(() => {
    const messagesContainer = document.getElementById('messages-container');
    if (messagesContainer) {
      messagesContainer.scrollTo({
        top: messagesContainer.scrollHeight,
        // behavior: 'smooth'
      });
    }
  }, [messages]);

  return (

    <div id="messages-container" className="flex flex-col w-full h-full lg:pl-48 pt-16 lg:pb-16 mb-36 relative overflow-y-auto overflow-x-hidden">
      {messages.map((message, index) => (
        <Message key={index} message={message} />
      ))}
    </div>
  )
}

export default Messages