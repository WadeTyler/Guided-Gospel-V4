/**
 * Note: Use position fixed according to your needs
 * Desktop navbar is better positioned at the bottom
 * Mobile navbar is better positioned at bottom right.
 **/

import { cn } from "../lib/utils";
import { IconLayoutNavbarCollapse } from "@tabler/icons-react";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from "react";
import { useQuery } from '@tanstack/react-query';

import { IconHomeFilled } from "@tabler/icons-react";
import { IconMessageCircleFilled } from "@tabler/icons-react";
import { IconBible } from "@tabler/icons-react";
import { IconSettingsFilled } from "@tabler/icons-react"
import { IconLogout } from "@tabler/icons-react";
import { IconSunMoon } from '@tabler/icons-react';
import { IconShieldLockFilled } from '@tabler/icons-react';


export const Navbar = () => {

  const { data:authUser } = useQuery({ queryKey: ['authUser'] });
  const { data:authAdmin } = useQuery({ queryKey: ['authAdmin'] });

  // Dark Mode
const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

useEffect(() => {
  // Apply the 'dark' class to the HTML element based on darkMode state
  if (darkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}, [darkMode]);

const toggleDarkMode = () => {
  // Update state and localStorage simultaneously
  setDarkMode((prevMode) => {
    const newMode = !prevMode;
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    return newMode;
  });
};



  const [items, setItems] = useState<{ title: string; icon: React.ReactNode; href: string; func?: () => void }[]>([]);

  useEffect(() => {
    if (authUser) {
      setItems([
        { title: "Home", icon: <IconHomeFilled className="text-primary" />, href: "/" },
        { title: "Guided Chat", icon: <IconMessageCircleFilled className="text-primary" />, href: "/chat" },
        { title: "Bible", icon: <IconBible className="text-primary" />, href: "/bible" },
        { title: "Change Theme", icon: <IconSunMoon className="text-primary" />, href: "#", func: toggleDarkMode,
        },
        { title: "Settings", icon: <IconSettingsFilled className="text-primary" />, href: "/settings" },
        { title: "Logout", icon: <IconLogout className="text-primary" />, href: "/logout" },
      ]);
    } else {
      setItems([
        { title: "Home", icon: <IconHomeFilled className="text-primary" />, href: "/" },
        { title: "Guided Chat", icon: <IconMessageCircleFilled className="text-primary" />, href: "/chat" },
        { title: "Bible", icon: <IconBible className="text-primary" />, href: "/bible" },
        { title: "Change Theme", icon: <IconSunMoon className="text-primary" />, href: "#", func: toggleDarkMode,
        },
    ]);
    }

    if (authAdmin) {
      console.log("Here");
      setItems((prev) => [...prev, { title: "Admin Panel", icon: <IconShieldLockFilled className="text-primary" />, href: "/admin" }]);
    }
  }, [authUser, authAdmin]);

  return (
    <FloatingDock 
      items={items}
      desktopClassName="fixed bottom-5 left-1/2 -translate-x-1/2 z-50"
      mobileClassName="fixed bottom-5 right-5 z-50"
    />
  );
}

export const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
}: {
  items: { title: string; icon: React.ReactNode; href: string; func?: () => void }[];
  desktopClassName?: string;
  mobileClassName?: string;
}) => {
  return (
    <>
      <FloatingDockDesktop items={items} className={desktopClassName} />
      <FloatingDockMobile items={items} className={mobileClassName} />
    </>
  );
};

const FloatingDockMobile = ({
  items,
  className,
}: {
  items: { title: string; icon: React.ReactNode; href: string, func?: () => void }[];
  className?: string;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn("relative block md:hidden", className)}>
      <AnimatePresence>
        {open && (
          <motion.div
            layoutId="nav"
            className="absolute bottom-full mb-2 inset-x-0 flex flex-col gap-2"
          >
            {items.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: 10,
                  transition: {
                    delay: idx * 0.05,
                  },
                }}
                transition={{ delay: (items.length - 1 - idx) * 0.05 }}
              >
                <Link
                  to={item.href}
                  key={item.title}
                  onClick={() => 
                    item.func && item.func()
                  }
                  className="h-12 w-12 rounded-full bg-zinc-600 dark:bg-white flex justify-center items-center"
                >
                  <div className="h-6 w-6">{item.icon}</div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen(!open)}
        className="h-12 w-12 rounded-full bg-zinc-600 dark:bg-white flex items-center justify-center"
      >
        <IconLayoutNavbarCollapse className="h-6 w-6 text-primary" />
      </button>
    </div>
  );
};

const FloatingDockDesktop = ({
  items,
  className,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  className?: string;
}) => {
  let mouseX = useMotionValue(Infinity);
  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "mx-auto hidden md:flex h-16 gap-4 items-end  rounded-2xl bg-zinc-600 px-4 pb-3",
        className
      )}
    >
      {items.map((item) => (
        <IconContainer mouseX={mouseX} key={item.title} {...item} />
      ))}
    </motion.div>
  );
};

function IconContainer({
  mouseX,
  title,
  icon,
  href,
  func,
}: {
  mouseX: MotionValue;
  title: string;
  icon: React.ReactNode;
  href: string;
  func?: () => void;
}) {
  let ref = useRef<HTMLDivElement>(null);

  let distance = useTransform(mouseX, (val) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };

    return val - bounds.x - bounds.width / 2;
  });

  let widthTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  let heightTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);

  let widthTransformIcon = useTransform(distance, [-150, 0, 150], [20, 40, 20]);
  let heightTransformIcon = useTransform(
    distance,
    [-150, 0, 150],
    [20, 40, 20]
  );

  let width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  let widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const [hovered, setHovered] = useState(false);

  if (func) return (
    <button onClick={func}>
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="aspect-square rounded-full dark:bg-zinc-950 bg-zinc-800 flex items-center justify-center relative"
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 2, x: "-50%" }}
              className="px-2 py-0.5 whitespace-pre rounded-md bg-gray-100 border dark:bg-zinc-900 dark:border-neutral-900 dark:text-white border-gray-200 text-neutral-700 absolute left-1/2 -translate-x-1/2 -top-8 w-fit text-xs"
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className="flex items-center justify-center"
        >
          {icon}
        </motion.div>
      </motion.div>
    </button>
  )
  
  if (!func) return (
    <Link to={href}>
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="aspect-square rounded-full dark:bg-zinc-950 bg-zinc-800 flex items-center justify-center relative"
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 2, x: "-50%" }}
              className="px-2 py-0.5 whitespace-pre rounded-md bg-gray-100 border dark:bg-zinc-900 dark:border-neutral-900 dark:text-white border-gray-200 text-neutral-700 absolute left-1/2 -translate-x-1/2 -top-8 w-fit text-xs"
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className="flex items-center justify-center"
        >
          {icon}
        </motion.div>
      </motion.div>
    </Link>
  );
}
