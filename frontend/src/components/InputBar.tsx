import React from 'react'
import { PlaceholdersAndVanishInput } from './placeholders-and-vanish-input';

export const InputBar: React.FC<{
    cn?: string;
    handleSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
    setUserInput?: React.Dispatch<React.SetStateAction<string>>;
  }> = ({ cn = '', handleSubmit, setUserInput }) => {
    

    const placeholders = [
        "Ask me anything...",
        "What does Jesus say about Love?...",
        "What does the Bible say about Sinning?...",
        "Who is Moses?...",
        "Where should I start in the bible?...",
    
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value);
        if (setUserInput) {
          setUserInput(e.target.value);
        }
      };
    
      const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (handleSubmit) {
          handleSubmit(e);
        }
      };

  return (
    <div className={`${cn ? cn : ''} z-40`}>
        {handleSubmit && 
            <PlaceholdersAndVanishInput 
                placeholders={placeholders}
                onChange={handleChange}
                onSubmit={handleSubmit}
            />}
    </div>
    
  )
}
