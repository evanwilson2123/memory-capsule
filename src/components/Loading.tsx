"use client";

import React from "react";
import { FaSpinner } from "react-icons/fa";

const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500">
      <div className="text-center max-w-4xl mx-auto p-6">
        <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
          Please Wait...
        </h1>
        <p className="text-xl text-white mb-8 leading-relaxed">
          We’re preparing your content. This won't take long.
        </p>
        <div className="flex justify-center items-center">
          <FaSpinner className="text-white text-6xl animate-spin" />
        </div>
      </div>
    </div>
  );
};

export default Loading;
