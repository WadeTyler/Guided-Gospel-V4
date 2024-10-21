import React, {useState, useEffect} from 'react'
import { motion, useScroll } from "framer-motion";
import { GridPattern } from "../GridPattern";
import { ChatBubble } from './ChatBubble';
import { InputBar } from '@components/InputBar';


export const ConvoBox = ({
  currentMessages
}: {
  currentMessages: {sender: string; message: string;}[]
}) => {

    
  return (
    <div className='flex flex-col w-full h-screen'>
        <div className="convo-container w-full flex flex-col p-4 md:p-10 max-h-[40rem] overflow-y-auto  ">
            {currentMessages.map((item, index) => (
              <ChatBubble sender={item.sender} message={item.message} key={index} />
            ))}
        </div>

    </div>
  )
}
