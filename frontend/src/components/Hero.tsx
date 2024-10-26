
import { useEffect, useState } from "react";
import { motion, useScroll } from "framer-motion";


import { Link } from "react-router-dom";
import BackgroundPattern from "./BackgroundPattern";
export const Hero = () => {


  const [isHalf, setIsHalf] = useState(false);
  const { scrollY } = useScroll();
  useEffect(() => {
    const handleScroll = () => {
      if (scrollY.get() > (window.innerHeight * 2) / 10) {
        setIsHalf(true);
      } else {
        setIsHalf(false);
      }
    };
    scrollY.onChange(handleScroll);
    return () => {
      scrollY.clearListeners();
    };
  }, []);

  return (
    <div className="px-4 group bg-white dark:bg-darkbg">
      <BackgroundPattern />
      <div className="relative z-10 max-w-7xl mx-auto mt-32 flex flex-col justify-center items-center">

        

        <motion.h1 initial={{y: -100, opacity: 0}} whileInView={{y: 0, opacity: 1}} transition={{duration: .5}}
        className="font-semibold text-4xl sm:text-7xl text-center max-w-5xl mx-auto text-zinc-800 dark:text-white leading-tight tracking-tight">
          Discover <span className="text-primary">Scripture</span> Anytime, Anywhere{" "}
          powered by <span className="text-primary">Faith</span>
        </motion.h1>
        <motion.p initial={{opacity: 0}} whileInView={{opacity: 1}} transition={{duration: .5, delay: .5}}
        className="mx-auto mt-6 max-w-3xl text-xl tracking-tight text-zinc-600 dark:text-darktext text-center leading-normal">
        Guided Gospel is your AI companion for exploring the Christian Bible.
        Whether you're seeking answers to life's questions or simply looking to deepen your understanding of Scripture, Guided is here to help you with biblical insights, any time of the day.
        </motion.p>

        <Link to="/chat"
        className="submit-btn mt-8"
        >Chat With Guided Now</Link>

        <div
          style={{ perspective: "1000px" }}
          className="overflow-hidden pt-20 px-4 w-full relative"
        >
          <motion.div
            animate={{
              rotateX: isHalf ? 0 : 45,
              scale: isHalf ? [0.8, 1.05, 1] : 0.8,
              transition: {
                type: "spring",
                stiffness: 100,
                damping: 20,
                mass: 0.5,
              },
              boxShadow: isHalf ? "0px 4px 24px rgba(245,158,11,1)" : "none",
            }}
            className="relative w-[100%] overflow-hidden md:w-3/4 mx-auto h-[12rem] sm:h-[16rem] md:h-[24rem] lg:h-[32rem] -mb-12 md:-mb-32 max-w-5xl rounded-t-3xl"
          >
            <img src="./images/gg-hero.png" alt="Hero Image" 
            className="rounded-t-3xl"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};
