"use client";

import React from "react";
import { useRouter } from "next/navigation";

const Hero: React.FC = () => {
  const router = useRouter(); // Correctly use the hook at the top level of the component

  const getStarted = (): void => {
    console.log("Get Started");
    router.push("/sign-up"); // Use the router to navigate
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">
          Welcome to Memory Capsule
        </h1>
        <p className="text-xl text-white mb-8">
          Create, store, and share your most cherished memories, set to unlock
          at a future date.
        </p>
        <button
          className="px-6 py-3 bg-white text-blue-500 font-semibold rounded-full hover:bg-gray-300 transition duration-300"
          onClick={getStarted} // Attach the event handler to the button
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Hero;
