import { motion } from "framer-motion";

import { useMotionValue } from "framer-motion";
import { CardPattern } from "./CardPattern";

export const Pricing = () => {

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
      id="pricing"
      className="min-h-[40rem] px-4 bg-zinc-900 py-20 md:py-40 relative group overflow-hidden"
      onMouseMove={onMouseMove}
    >
      <div className="max-w-xl md:mx-auto md:text-center xl:max-w-none relative z-10">
        <h2
        className="font-display text-3xl tracking-tight text-white sm:text-4xl md:text-5xl">
          Our pricing will surprise you
        </h2>
        <motion.p initial={{y:100, opacity: 0}} whileInView={{y:0, opacity: 1}} transition={{duration: .5}}
        className="mt-6 text-lg tracking-tight  text-blue-100">
          Because it's <span className="text-primary">Free</span>!
        </motion.p>
      </div>
      <div className="flex justify-center items-center flex-col mt-6">
        {/* <motion.h3 initial={{y:100, opacity: 0}} whileInView={{y:0, opacity: 1}} transition={{duration: .5}}
        className="font-display text-2xl tracking-tight text-blue-100 sm:text-3xl md:text-4xl italic">"Did you say Free?!"</motion.h3> */}
        <motion.p initial={{y:100, opacity: 0}} whileInView={{y:0, opacity: 1}} transition={{duration: .5}}
        className="text-lg tracking-tight text-white max-w-3xl">Yes! Free! Guided Gospel is Free because we believe that spiritual guidance and biblical insight should be accessible to everyone, without barriers or costs. Unlike other Christian AI apps, we believe 
          <span className="text-primary"><br/>Your faith journey shouldn't come with a price tag.</span>
        </motion.p>
      </div>
      <CardPattern {...pattern} mouseX={mouseX} mouseY={mouseY} />
    </div>
  );
};
