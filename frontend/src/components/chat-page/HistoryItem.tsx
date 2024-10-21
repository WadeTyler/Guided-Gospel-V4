import React from 'react'
import { useEffect, useState } from 'react'


interface HistoryItemProps {
    date?: Date;
    summary: string;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({date, summary}) => {

    const [formattedDate, setFormattedDate] = useState("");

    useEffect(() => {
        if (date instanceof Date) {
            setFormattedDate(date.toLocaleDateString());
        }
    }, [date])

  return (

    <div className='text-white flex flex-col py-3 border-b-[2px] border-primary cursor-pointer hover:translate-x-3 transition-all duration-300 ease-in-out '>
        {date && <p className="text-xs lg:text-lg">{formattedDate}</p>}
        <p className="text-sm lg:text-xl">{summary}</p>
    </div>
  )
}
