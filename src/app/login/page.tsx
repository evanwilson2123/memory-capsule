// pages/login.tsx (or wherever your login page is)
import { SignIn } from "@clerk/nextjs";
import React from "react";

const LoginPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-6">
      <SignIn
        appearance={{
          elements: {
            card: "bg-white p-8 rounded-lg shadow-lg w-full max-w-md", // Similar card styling
            formFieldInput:
              "text-black w-full p-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500", // Input styling
            primaryButton:
              "w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 transition duration-300", // Button styling
            footerAction__signUp: "text-blue-500 hover:underline", // Link styling
          },
          variables: {
            colorPrimary: "#4F46E5", // Primary color for buttons and other elements
            borderRadius: "0.5rem", // Border radius for buttons, inputs, etc.
          },
        }}
        routing="hash"
      />
    </div>
  );
};

export default LoginPage;
