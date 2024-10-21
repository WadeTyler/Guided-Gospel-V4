import { features } from "../constants/features";
import { motion, useMotionValue } from "framer-motion";
import React from "react";

import { AiFillPieChart } from "react-icons/ai";
import { CardPattern } from "./CardPattern";

type FeatureType = {
  heading: string;
  description: string | any;
  icon: any;
};

export const SubHero = () => {
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  function onMouseMove({ currentTarget, clientX, clientY }: any) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }
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
  return (
    <div
      id="features"
      className="px-4 bg-zinc-900 py-20 md:py-40 relative group"
      onMouseMove={onMouseMove}
    >
      <div className="absolute w-96 h-96 -left-20 -top-20 bg-gradient-to-t from-[#9890e3] to-[#b1f4cf] blur-3xl rounded-full opacity-20" />
      <motion.div initial={{y:-100, opacity: 0}} whileInView={{y:0, opacity: 1}} transition={{duration: .5}}
      className="max-w-2xl md:mx-auto md:text-center xl:max-w-none">
        <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl md:text-5xl">
          Faith at Your Fingertips – Learn, Ask, Grow.
        </h2>
        <p className="mt-6 text-lg tracking-tight text-blue-100">
          Get answers to your biggest questions... without wandering the desert for 40 years.
        </p>
      </motion.div>

      <CardPattern {...pattern} mouseX={mouseX} mouseY={mouseY} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 max-w-5xl mx-auto gap-20 my-20 md:my-40 px-4">
        {features.map((feature: FeatureType, idx: number) => (
          <Card
            key={`feature-${idx}`}
            heading={feature.heading}
            description={feature.description}
            icon={feature.icon}
          />
        ))}
      </div>
    </div>
  );
};

const Card = ({ heading, description, icon }: FeatureType) => {
  return (
    <div className="flex flex-col items-start">
      <IconContainer icon={icon} />
      <motion.div initial={{opacity: 0, scale: 0, y:-100, x:-100}} whileInView={{ opacity: 1, scale: 1, y: 0, x:0}} transition={{duration: .5, delay: Math.random()/2}}
      className="mt-8">
        <h2 className="text-white text-2xl">{heading}</h2>
        <p className="text-sm text-zinc-100 mt-8 leading-relaxed">
          {description}
        </p>
      </motion.div>
    </div>
  );
};

const IconContainer = ({ icon }: any) => {
  return (
    <motion.div initial={{opacity: 0}} whileInView={{opacity: 1}} transition={{duration: .5}}
    className="relative">
      <div className="absolute inset-0 bg-primary/50 transform  rounded-md blur-lg" />

      <div className="h-10 w-10 rounded-2xl  backdrop-blur-sm flex items-center justify-center  bg-white bg-grid-extrasmall-zinc-200  overflow-hidden">
        {/* <AiFillPieChart className="text-primary h-4 w-4 relative z-50" /> */}
        {icon}
        <div className="absolute inset-0 bg-white [mask-image:linear-gradient(to_bottom,transparent,white_4rem,white_calc(100%-4rem),transparent)] z-40" />
      </div>
    </motion.div>
  );
};
