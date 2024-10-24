
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const CTA = ({ headerText, bodyText }: any) => {
  return (
    <motion.div 
    initial={{y:100, opacity: 0}}
    whileInView={{y:0, opacity: 1}}
    transition={{duration: .5}}
    className="relative rounded-2xl bg-vulcan-700 mx-4  mb-20 mt-20 text-gray-100 max-w-6xl lg:mx-auto  min-h-96 h-full  overflow-hidden pb-4">
      <div
        className="absolute inset-0 top-0  bg-grid-vulcan-500"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent, white, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, white, transparent)",
        }}
      ></div>

      <div className=" lg:grid lg:grid-cols-1 gap-10 p-2 md:p-8 relative z-20">
        <div className="text-center lg:text-left">
          <h2 className="text-2xl md:text-4xl font-bold my-4  text-center">
            {headerText || `So what are you waiting for?`}
          </h2>
          <p className="my-4 text-base text-gray-300 md:text-lg tracking-wide font-light  text-center max-w-lg mx-auto">
            {bodyText ||
              `Connect with Guided Gospel now and experience personalized biblical guidance and inspiration. It’s free, easy, and ready whenever you are!`}
          </p>

          <div className="flex justify-center">
            <Link to="/chat" className="bg-primary px-4 py-2 rounded-2xl text-neutral-800 hover:bg-neutral-800 shadow-md hover:text-primary transition-all ease-in-out duration-300">Chat with Guided</Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
