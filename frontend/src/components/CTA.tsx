
import React from "react";
import { Link } from "react-router-dom";
import Button from "./Button";

export const CTA = ({ headerText, bodyText }: any) => {
  return (
    <div className="relative rounded-2xl bg-vulcan-700 mx-4  mb-20 mt-20 text-gray-100 max-w-6xl lg:mx-auto  min-h-96 h-full  overflow-hidden pb-4">
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
            <Button as="button" variant="large" className="rounded-2xl py-2">
              <Link to="/chat">Chat with Guided</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
