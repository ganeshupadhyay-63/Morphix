import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import image from "../assets/user_group.png";

const Typewriter = ({ text, speed = 100, pause = 1500, className }) => {
  const [displayed, setDisplayed] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let timeout;

    if (index < text.length) {
      
      timeout = setTimeout(() => {
        setDisplayed((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, speed);
    } else {
      
      timeout = setTimeout(() => {
        setDisplayed("");
        setIndex(0);
      }, pause);
    }

    return () => clearTimeout(timeout);
  }, [index, text, speed, pause]);

  return (
    <span className={className}>
      {displayed}
      <span className="animate-pulse">|</span>
    </span>
  );
};

const About = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const handleClick = () => {
    setMessage(" No video available yet.");
  };

  return (
    <div className="px-4 sm:px-20 xl:px-32 relative inline-flex flex-col w-full justify-center bg-[url(/bg.png)] bg-cover bg-no-repeat min-h-screen">
      {/* Heading + Subtitle */}
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-4xl md:text-3xl 2xl:text-5xl font-bold mx-auto leading-[1.2]">
          Unleash Creativity <br />
          <Typewriter text="Powered by AI" className="text-primary" />
        </h1>

        <p className="mt-4 max-w-xs sm:max-w-lg 2xl:max-w-xl m-auto max-sm:text-xs text-gray-800 font-semibold">
          Elevate your creativity with our premium AI tools — write articles,
          generate stunning images, and streamline your entire workflow.
        </p>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-wrap justify-center gap-4 text-sm max-sm:text-xs">
        <button
          className="bg-red-700 text-white px-10 py-3 rounded-lg hover:scale-105 active:scale-95 transition cursor-pointer"
          onClick={() => navigate("/ai")}
        >
          Start Creating Now
        </button>
        <button
          className="bg-gray-700 text-white px-10 py-3 rounded-lg border border-gray-300 hover:scale-105 active:scale-95 transition cursor-pointer"
          onClick={handleClick}
        >
          Watch Demo
        </button>
      </div>

      {/* Message after Watch Demo */}
      {message && (
        <p className="mt-4 text-center text-gray-500 italic">{message}</p>
      )}

      {/* Trusted Users */}
      <div className="flex items-center gap-2 mt-8 mx-auto text-gray-800 text-sm sm:text-base font-semibold">
        <img src={image} alt="Users" className="h-6 sm:h-8" />
        <span>
          Trusted by <span className="font-semibold">10k+ people</span>
        </span>
      </div>
    </div>
  );
};

export default About;
