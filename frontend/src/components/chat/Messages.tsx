import React from 'react'
import { formatTimestamp } from '../../lib/utils'

const Messages = ({messages}: {
  messages: {
    messageid: string;
    sessionid: string;
    userid: string;
    timestamp: string;
    sender: string;
    text: string;
}[];

}) => {
  return (
    <div className="flex flex-col w-full h-full pl-48 pt-16 pb-16 mb-36 relative overflow-auto">
      {messages.map((message, index) => (
          <div key={index} className={`flex flex-col relative group ${message.sender === 'ai' ? 'self-start translate-x-16' : 'self-end -translate-x-16'}`}>
            <p className={`text-neutral-800 w-full ${message.sender === 'ai' ? 'text-start pl-3': 'text-end pr-3'}`}>
              {message.sender === 'ai' ? 'Guided:' : 'You:'}
            </p>
            <p className={`max-w-[40rem] w-fit p-3 text-white rounded-2xl ${message.sender === 'ai' ? 'bg-neutral-800' : 'bg-zinc-500 self-end'}`}>
              {message.text}
            </p>
            <span className='text-transparent group-hover:text-neutral-800 transition-all ease-in-out duration-300'>{formatTimestamp(message.timestamp)}</span>
          </div>
      ))}
    </div>
  )
}

export default Messages