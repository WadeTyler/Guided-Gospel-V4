import clsx from "clsx";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { FloatingDock } from "./floating-dock";
import { IconHomeFilled } from "@tabler/icons-react";
import { IconMessageCircleFilled } from "@tabler/icons-react";
import { IconSettingsFilled } from "@tabler/icons-react"

export const Container = (props: any) => {
  const { children, className, ...customMeta } = props;


  const title = "Guided Gospel | Your AI Bible Companion";
  const meta = {
    title,
    description: `Guided Gospel is your AI companion for exploring the Christian Bible.`,
    type: "website",
    image: "",
    ...customMeta,
  };

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="robots" content="follow, index" />
        <meta content={meta.description} name="description" />
        <meta property="og:type" content={meta.type} />
        <meta property="og:site_name" content="guidedgospel" />
        <meta property="og:description" content={meta.description} />
        <meta property="og:title" content={meta.title} />
      </Head>
  
      <FloatingDock 
        items={[
          {title: "Home", icon: <IconHomeFilled className="text-primary" />, href: "/"},
          {title: "Guided Chat", icon: <IconMessageCircleFilled className="text-primary" />, href: "/chat"},
          {title: "Settings", icon: <IconSettingsFilled className="text-primary"/>, href: "#"},
          ]} 
        desktopClassName="fixed bottom-5 left-1/2 -translate-x-1/2 z-50"
        mobileClassName="fixed bottom-5 right-5 z-50"
      />
      <main className={clsx("antialiased ", className)}>{children}</main>
      
    </>
  );
};
