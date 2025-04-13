import React from 'react';
import Loading from "../Loading.tsx";
import {formatTimestamp} from "../../lib/utils.ts";
import {motion} from "framer-motion";
import {Message as MessageType} from "../../types/message.types.ts";

const Message = ({message}: {
  message: MessageType;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: message.sender === 'ai' ? '-100%' : '100%'}}
      animate={{ opacity: 1, x: 0}}
      transition={{ duration: 0.5 }}
      className={`flex flex-col relative group-parent ${message.sender === 'ai' ? 'self-start translate-x-16 lg:ml-10' : 'self-end -translate-x-16 lg:mr-10'}`}>
      <p className={`text-neutral-800 dark:text-darktext w-full ${message.sender === 'ai' ? 'text-start pl-3': 'text-end pr-3'}`}>
        {message.sender === 'ai' ? 'Guided:' : 'You:'}
      </p>
      <p className={`max-w-[40rem] w-fit p-3 text-gray-200 rounded-2xl ${message.sender === 'ai' ? 'bg-neutral-800 dark:bg-darkaccent' : 'bg-zinc-500 dark:bg-neutral-600 self-end text-wrap break-words whitespace-pre-wrap'}`}>
        {/* Split the message into parts using '<br/><br/>' which is added by the AI */}
        { message.text === '...' ? <Loading size='sm' cn='text-primary' /> :
          message.text.split('<br/><br/>').map((paragraph, index) => (
            <React.Fragment key={index}>
              {paragraph.split('(jq)').map((text, index) => (
                <React.Fragment key={index}>
                  {index % 2 !== 0 ? (
                    <span className="text-primary italic">{text}</span>
                  ) : (
                    <span className="text-gray-200">{text}</span>
                  )}
                </React.Fragment>
              ))}

              {index < message.text.split('<br/><br/>').length - 1 && <><br /><br/></>}
            </React.Fragment>
          ))
        }

      </p>
      <span className='text-transparent group-parent-hover:text-neutral-800 dark:group-parent-hover:text-darktext transition-all ease-in-out duration-300'>{formatTimestamp(message.timestamp)}</span>
    </motion.div>
  );
};

export default Message;