
import React, { useEffect, useState } from "react";


import { GridPattern } from "./GridPattern";
import { motion, useScroll } from "framer-motion";

import { InputBar } from "./InputBar";
import { Link } from "react-router-dom";
export const Hero = () => {


  const pattern = {
    y: -6,
    squares: [
      [-1, 2],
      [1, 3],
      // Random values between -10 and 10
      ...Array.from({ length: 10 }, () => [
        Math.floor(Math.random() * 20) - 10,
        Math.floor(Math.random() * 20) - 10,
      ]),
    ],
  };

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
    <div className="px-4">
      <div className="absolute inset-0 rounded-2xl transition duration-300 [mask-image:linear-gradient(white,transparent)] group-hover:opacity-50">
        <GridPattern
          width={120}
          height={120}
          x="50%"
          className="absolute inset-x-0 inset-y-[-30%] h-[160%]  w-full skew-y-[-5deg] fill-primary stroke-gray-100"
          {...pattern}
        />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto mt-32 flex flex-col justify-center items-center">

        

        <motion.h1 initial={{y: -100, opacity: 0}} whileInView={{y: 0, opacity: 1}} transition={{duration: .5}}
        className="font-semibold text-4xl sm:text-7xl text-center max-w-5xl mx-auto text-zinc-800 leading-tight tracking-tight">
          Discover <span className="text-primary">Scripture</span> Anytime, Anywhere{" "}
          powered by <span className="text-primary">Faith</span>
        </motion.h1>
        <motion.p initial={{opacity: 0}} whileInView={{opacity: 1}} transition={{duration: .5, delay: .5}}
        className="mx-auto mt-6 max-w-3xl text-xl tracking-tight text-zinc-600 text-center leading-normal">
        Guided Gospel is your AI companion for exploring the Christian Bible.
        Whether you're seeking answers to life's questions or simply looking to deepen your understanding of Scripture, Guided is here to help you with biblical insights, any time of the day.
        </motion.p>

        <Link to="/chat"
        className="mt-8 px-6 py-3 text-lg text-white bg-primary rounded-full shadow-xl transition duration-300 hover:translate-y-2 hover:scale-105"
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
            }}
            className="relative w-[100%] overflow-x-hidden md:w-3/4 mx-auto h-[12rem] sm:h-[16rem] md:h-[24rem] lg:h-[32rem] -mb-12 md:-mb-32 max-w-5xl"
          >
            <img src="./images/chat-hero-image.png" alt="Hero Image" className="rounded-t-3xl"/>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
