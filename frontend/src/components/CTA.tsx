
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const CTA = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-white dark:bg-darkbg">
      <motion.div 
    initial={{y:100, opacity: 0}}
    whileInView={{y:0, opacity: 1}}
    transition={{duration: .5}}
    className="relative rounded-2xl bg-vulcan-700 dark:bg-darkaccent mx-4 my-20 text-gray-100 max-w-6xl w-full lg:mx-auto min-h-96 h-full overflow-hidden">
      <div
        className="absolute inset-0 top-0  bg-grid-vulcan-500 dark:bg-grid-neutral-700"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent, white, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, white, transparent)",
        }}
      ></div>

      <div className=" lg:grid lg:grid-cols-1 gap-10 p-2 md:p-8 relative z-20">
        <div className="text-center lg:text-left flex flex-col items-center justify-center h-full">
          <h2 className="text-2xl md:text-4xl font-bold my-4 mt-8 text-center">
            {`So what are you waiting for?`}
          </h2>
          <p className="my-4 text-base text-gray-300 md:text-lg tracking-wide font-light  text-center max-w-lg mx-auto">
            {`Connect with Guided Gospel now and experience personalized biblical guidance and inspiration. It’s free, easy, and ready whenever you are!`}
          </p>

          <div className="flex justify-center my-4">
            <Link to="/chat" className="submit-btn">Chat with Guided</Link>
          </div>
        </div>
      </div>
    </motion.div>
    </div>
    
  );
};
