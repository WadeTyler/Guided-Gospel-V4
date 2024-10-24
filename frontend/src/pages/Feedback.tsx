import { useMutation } from '@tanstack/react-query';
import { useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Loading from '../components/Loading';

const Feedback = ({type}: {type?: string;}) => {

  if (type === 'bugreport') {
    return <BugReport />
  }

  return <NormalFeedback />
  
}

const BugReport = () => {
  const navigate = useNavigate();

  const [category, setCategory] = useState<string>('');
  const [impact, setImpact] = useState<number>(1);
  const [issue, setIssue] = useState<string>('');
  

  const categories = [
    "",
    "Login/Signup/Logout",
    "Chat Issue",
    "Bible Issue",
    "Settings Issue",
    "Other"
  ];

  const impactScale = [
    "", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
  ]

  const { mutate:submitBugReport, isPending:isSubmittingBugReport } = useMutation({
    mutationFn: async ({ category, impact, issue }: { category: string, impact: number, issue: string }) => {
      try {
        const response = await fetch('/api/feedback/bugreport', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ category, impact, issue })
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
      toast.success("Bug Report submitted successfully. Thank You!");
      navigate('/');
    },
    onError: (error: Error) => {
      toast.error(error.message || "Something went wrong");
    }
  })

  const handleSubmit = () => {
    submitBugReport({ category, impact, issue });
  }
  
  return (
    <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1 }}
    className="w-full h-screen bg-white flex flex-col items-center justify-center ">
      <div className="w-[40rem] flex flex-col gap-4">
        <h1 className="text-primary text-3xl">Bug Report</h1>
        <p className="">Ran into an issue? Let us know so we can fix it!</p>
        <form action="" className='flex flex-col gap-4'>
          <div className="flex gap-4">

            <section className="">
              <label htmlFor="category" className='pl-3'>Category:</label>
              <select name="category" id="category" className='form-input-bar' onChange={(e) => setCategory(e.target.value)}>
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
            </section>

            
          </div>
          <section className="">
            <label htmlFor="impact" className='pl-3 text-sm'>On a scale of 1-10, how has this impacted your experience? (1 being Minor - 10 being Severely):</label>
            <select name="impact" id="impact" className='form-input-bar' onChange={(e) => {
              setImpact(parseInt(e.target.value));
            }}>
              {impactScale.map((impact, index) => (
                <option key={index} value={impact}>{impact}</option>
              ))}
            </select>
          </section>

          <textarea name="issue" id="issue" onChange={(e) => setIssue(e.target.value)}
          placeholder='Describe your Issue here'
          className='form-input-bar resize-none h-64 w-full'
          />

          {/* Buttons */}
          {!isSubmittingBugReport &&
            <section className="flex gap-4 items-center justify-center">
              <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSubmit();
              }}
              className="bg-primary px-4 py-2 rounded-2xl text-white hover:bg-neutral-800 hover:text-primary transition-all ease-in-out duration-300">Submit Bug Report</button>
              <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigate('/');
              }}
              className="bg-zinc-500 px-4 py-2 rounded-2xl text-white hover:bg-neutral-800 hover:text-white transition-all ease-in-out duration-300">Go Home</button>
            </section>
          }
          {
            isSubmittingBugReport && 
            <section className="flex items-center justify-center">
              <Loading size='lg' cn='text-primary flex justify-center items-center' />
            </section>
          }
        </form>
      </div>      
    </motion.div>
  );
}

const NormalFeedback = () => {
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