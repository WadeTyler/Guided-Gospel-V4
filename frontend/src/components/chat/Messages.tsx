
import React from 'react';
import { formatTimestamp } from '../../lib/utils'
import Loading from '../Loading';
import { motion } from 'framer-motion';


const Messages = ({messages }: {
  messages: {
    messageid?: string;
    sessionid?: string;
    userid?: string;
    timestamp: string;
    sender: string;
    text: string;
}[];

}) => {

  return (

    <div className="flex flex-col w-full h-full pl-48 pt-16 pb-16 mb-36 relative overflow-auto">
      
      {messages.map((message, index) => (
          <motion.div 
          initial={{ opacity: 0, x: message.sender === 'ai' ? '-100%' : '100%'}}
          animate={{ opacity: 1, x: 0}}
          transition={{ duration: 0.5 }}
          key={index} className={`flex flex-col relative group ${message.sender === 'ai' ? 'self-start translate-x-16 ml-10' : 'self-end -translate-x-16 mr-10'}`}>
            <p className={`text-neutral-800 w-full ${message.sender === 'ai' ? 'text-start pl-3': 'text-end pr-3'}`}>
              {message.sender === 'ai' ? 'Guided:' : 'You:'}
            </p>
            <p className={`max-w-[40rem] w-fit p-3 text-white rounded-2xl ${message.sender === 'ai' ? 'bg-neutral-800' : 'bg-zinc-500 self-end'}`}>
              {/* Split the message into parts using '<br/><br/>' which is added by the AI */}
              { message.text === '...' ? <Loading size='sm' cn='text-primary' /> : 
                message.text.split('<br/><br/>').map((paragraph, index) => (
                  <React.Fragment key={index}>
                    {paragraph.split('(jq)').map((text, index) => (
                      <React.Fragment key={index}>
                        {index % 2 !== 0 ? (
                          <span className="text-primary italic">{text}</span>
                        ) : (
                          text
                        )}
                      </React.Fragment>
                    ))}

                    {index < message.text.split('<br/><br/>').length - 1 && <><br /><br/></>}
                  </React.Fragment>
                ))
              }
              
            </p>
            <span className='text-transparent group-hover:text-neutral-800 transition-all ease-in-out duration-300'>{formatTimestamp(message.timestamp)}</span>
          </motion.div>
      ))}
    </div>
  )
}

export default Messages