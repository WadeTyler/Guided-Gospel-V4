import React, { useEffect, useState, useRef } from 'react'

export const ChatBubble: React.FC<{sender: string; message: string}> = ({sender, message}) => {

  const [outputMessage, setOutputMessage] = useState("");
  const messageRef = useRef(message); // Reference to the original message
  const outputRef = useRef(""); // Reference to the current outputMessage

  useEffect(() => {
    let i = 0;
    var speed = 25;
    let timeoutId: NodeJS.Timeout;

    if (sender === "user") {
      setOutputMessage(message); // For user, display message instantly
    } else {
      // Reset output and message refs
      outputRef.current = "";
      messageRef.current = message;

      const typeWriter = () => {
        if (i < messageRef.current.length) {
          outputRef.current += messageRef.current.charAt(i); // Safely append characters
          setOutputMessage(outputRef.current); // Update state with ref value
          i++;

          if (messageRef.current.charAt(i) === "<") {
            speed = 0;
          } 
          else if (messageRef.current.charAt(i) === ">") {
            speed = 25;
          }

          timeoutId = setTimeout(typeWriter, speed); // Recursively call typeWriter
        }
      };
      typeWriter();
    }

    return () => clearTimeout(timeoutId); // Cleanup timeout on unmount/re-render

  }, [message, sender]);

  return (
    <div className={`my-4 z-10 max-w-2xl lg:max-w-4xl flex flex-col ${sender === "user" ? 'self-end' : 'self-start'}`}>
      <p className={`text-zinc-900 ${sender === "user" ? 'self-end pr-4' : 'self-start pl-4'}`}>
        {sender === "user" ? "You:" : "Guided:"}
      </p>
      <div className={`text-white rounded-t-3xl p-4 ${sender === "user" ? 'bg-zinc-700 rounded-bl-3xl' : 'bg-zinc-900 rounded-br-3xl'}`}>
        <p className="text-zinc-300" dangerouslySetInnerHTML={{__html: outputMessage}}></p>
      </div>
    </div>
  );
}
