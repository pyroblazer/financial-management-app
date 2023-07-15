import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import hero from "./hero.png";

interface Props { }

const Hero = (props: Props) => {
  const heroMessages = [
    "Unfiltered financial data. Crystal clear decisions.",
    "Numbers don't lie. Neither should your investments.",
    "Beyond the headlines. Straight to the numbers.",
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentMessageIndex((prevIndex: number) => (prevIndex + 1) % heroMessages.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const currentMessage = heroMessages[currentMessageIndex];

  return (
    <section id="hero">
      <div className="container flex flex-col-reverse mx-auto p-8 lg:flex-row">
        <div className="flex flex-col space-y-10 mb-44 m-10 lg:m-10 xl:m-20 lg:mt:16 lg:w-1/2 xl:mb-52">
          <h1 className="text-5xl font-bold text-center lg:text-5xl lg:max-w-md lg:text-left animate-fade">
            {currentMessage}
          </h1>
          <p className="text-2xl text-center text-gray-400 lg:max-w-md lg:text-left">
            Cut through the clutter of biased reporting and fabricated news to find the financial information you need.
          </p>
          <div className="mx-auto lg:mx-0">
            <Link
              to="/search"
              className="py-5 px-10 text-2xl font-bold text-white bg-purple rounded lg:py-4 hover:opacity-70"
            >
              Get Started
            </Link>
          </div>
        </div>
        <div className="mb-24 mx-auto md:w-180 md:px-10 lg:mb-0 lg:w-1/2">
          <img src={hero} alt="" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
