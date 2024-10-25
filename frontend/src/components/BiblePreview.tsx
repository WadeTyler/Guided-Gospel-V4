import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const BiblePreview = () => {
  return (
    <div className="flex flex-col items-center">
      <motion.div initial={{y:100, opacity: 0}} whileInView={{y:0, opacity: 1}} transition={{duration: .5}}
      className="max-w-2xl md:mx-auto md:text-center xl:max-w-none mb-10">
        <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl md:text-5xl">
          Check out our Built in Bible
        </h2>
        <p className="mt-6 text-lg tracking-tight text-blue-100">
          We have a bible built in ready for you to read with just 1 click, so you have all of your resources in the same place!
        </p>
      </motion.div>
      <Link to="/bible" className='mb-10 submit-btn'>Check it Out Here</Link>
      <motion.img 
      initial={{opacity:0, y:100}}
      whileInView={{opacity:1, y:0, boxShadow: '0px 4px 24px rgba(245,158,11,1)'}}
      transition={{duration:.5}}
      src="./images/bible-preview.png" alt="" className="w-[40rem] rounded-3xl" />
    </div>
  )
}

export default BiblePreview;