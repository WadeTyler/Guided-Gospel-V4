import { useMutation } from '@tanstack/react-query';
import { useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Loading from '../components/Loading';

const Feedback = () => {
  const [feedback, setFeedback] = useState<string>('');
  const navigate = useNavigate();

  const { mutate:submitFeedback, isPending:isSubmittingFeedback } = useMutation({
    mutationFn: async (feedback:string) => {
      try {
        const response = await fetch('/api/feedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ feedback })
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message);
        }

        return data;
      } catch (error) {
        throw new Error((error as Error).message)
      }
    },
    onSuccess: () => {
      toast.success("Feedback submitted successfully. Thank You!");
      navigate('/');
    },
    onError: (error: Error) => {
      toast.error(error.message || "Something went wrong");
    }
  })

  const handleSubmit = () => {
    submitFeedback(feedback);
  }

  return (
    <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1 }}
    className="w-full h-screen bg-white flex flex-col items-center justify-center ">
      <div className="w-[40rem] flex flex-col gap-4">
        <h1 className="text-primary text-3xl">Share your Feedback</h1>
        <p className="">We would love to hear your feedback, so we can improve Guided Gospel for everyone.</p>
        <form action="" className='flex flex-col gap-4'>
          <textarea name="feedback" id="feedback" onChange={(e) => setFeedback(e.target.value)}
          placeholder='Share your feedback here...'
          className='form-input-bar resize-none h-64 w-full'
          />
          {!isSubmittingFeedback &&
            <section className="flex gap-4 items-center justify-center">
              <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSubmit();
              }}
              className="bg-primary px-4 py-2 rounded-2xl text-white hover:bg-neutral-800 hover:text-primary transition-all ease-in-out duration-300">Submit Feedback</button>
              <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigate('/');
              }}
              className="bg-zinc-500 px-4 py-2 rounded-2xl text-white hover:bg-neutral-800 hover:text-white transition-all ease-in-out duration-300">Go Home</button>
            </section>
          }
          {isSubmittingFeedback && 
            <section className="flex items-center justify-center">
              <Loading size='lg' cn='text-primary flex justify-center items-center' />
            </section>
          }
        </form>
      </div>      
    </motion.div>
  )
}

export default Feedback