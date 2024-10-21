import React from "react";
import Logo from "./Logo";
import { CustomLink } from "./CustomLink";
import {
  AiOutlineGithub,
  AiOutlineLinkedin,
  AiOutlineTwitter,
} from "react-icons/ai";

export const Footer = () => {
  const socials = [
    {
      name: "twitter",
      icon: (
        <AiOutlineTwitter className="h-5 w-5 hover:text-primary transition duration-150" />
      ),
      link: "https://twitter.com/aceternitylabs",
    },
    {
      name: "LinkedIn",
      icon: (
        <AiOutlineLinkedin className="h-5 w-5 hover:text-primary transition duration-150" />
      ),
      link: "https://linkedin.com/in/manuarora28",
    },
    {
      name: "GitHub",
      icon: (
        <AiOutlineGithub className="h-5 w-5 hover:text-primary transition duration-150" />
      ),
      link: "https://github.com/aceternity",
    },
  ];
  return (
    <div className="border-t border-slate-900/5 py-10 max-w-6xl mx-auto px-8">
      
      <div className="flex flex-col justify-center items-center py-10 ">
        
        <Logo textClassName="text-black text-xl" />
        <p className="text-slate-500 text-sm font-light text-center mt-8 border-t border-zinc-100 pt-4">
          © {new Date().getFullYear()} Guided Gospel. All rights
          reserved.
        </p>
        
      </div>
    </div>
  );
};
