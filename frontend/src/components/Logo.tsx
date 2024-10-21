import clsx from "clsx";

import Link from "next/link";
import React from "react";
import { twMerge } from "tailwind-merge";

const Logo = ({
  textClassName,
  logoClassName,
}: {
  textClassName?: string;
  logoClassName?: string;
}) => {
  return (
    <img src="/images/guided-logo-green.jpg/" alt="" className="w-10 rounded-xl object-contain"/>
  );
};

export default Logo;
