import React from 'react'
import { HistoryItem } from './HistoryItem'
import { IconHomeFilled } from "@tabler/icons-react";
import { motion } from "framer-motion";

export const Sidebar = () => {
  return (
    <motion.div 
    initial={{x: '-100%'}}
    whileInView={{x:0}}
    transition={{duration: .5}}
    className="md:relative absolute md:visible hidden md:w-64 lg:w-96 h-screen bg-zinc-900 md:flex flex-col text-white items-center py-4 gap-5 z-30">
        <div className=" ">
            <h1 className="text-2xl lg:text-4xl text-white font-bold mb-2">Guided Gospel</h1>
            <div className="flex gap-4 py-3 ml-1 lg:ml-4 cursor-pointer hover:translate-x-3 transition-all duration-300 ease-in-out">
                <IconHomeFilled className='lg:scale-125' />
                <p className="text-lg lg:text-xl">New Chat</p>
            </div>
        </div>
        
        {/* History Items */}
        <div className="flex flex-col gap-2">
            <HistoryItem date={new Date()} summary={"Jesus talks about Love"}/>
            <HistoryItem date={new Date()} summary={"Faith Guidance"}/>
            <HistoryItem date={new Date()} summary={"Moses and the Serpent"}/>
            <HistoryItem date={new Date()} summary={"The Vineyard Parable"}/>
        </div>
    </motion.div>
  )
}
