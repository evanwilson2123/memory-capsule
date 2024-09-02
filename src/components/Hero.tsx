"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { SignedOut, SignedIn } from "@clerk/nextjs";

const Hero: React.FC = () => {
  const router = useRouter();

  const getStarted = (): void => {
    console.log("Get Started");
    router.push("/create-capsule");
  };

  return (
    <>
      <SignedOut>
        <div className="flex items-center justify-center h-screen bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500">
          <div className="text-center max-w-4xl mx-auto p-6">
            <h1 className="text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg">
              Welcome to Memory Capsule
            </h1>
            <p className="text-2xl text-white mb-8 leading-relaxed drop-shadow-md">
              Capture your most cherished memories and set them to unlock at a
              future date, preserving moments forever.
            </p>
            <button
              className="px-8 py-4 bg-white text-purple-600 font-bold rounded-full shadow-lg hover:bg-purple-100 transition duration-300 transform hover:scale-105"
              onClick={getStarted}
            >
              Get Started
            </button>
          </div>
        </div>
      </SignedOut>
      <SignedIn>
        <div className="flex items-center justify-center h-screen bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500">
          <div className="text-center max-w-4xl mx-auto p-6">
            <h1 className="text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg">
              Welcome Back to Memory Capsule
            </h1>
            <p className="text-2xl text-white mb-8 leading-relaxed drop-shadow-md">
              Ready to preserve more memories? Click below to create a new
              memory capsule.
            </p>
            <button
              className="px-8 py-4 bg-white text-purple-600 font-bold rounded-full shadow-lg hover:bg-purple-100 transition duration-300 transform hover:scale-105"
              onClick={getStarted}
            >
              Create Memory Capsule
            </button>
          </div>
        </div>
      </SignedIn>
    </>
  );
};

export default Hero;
