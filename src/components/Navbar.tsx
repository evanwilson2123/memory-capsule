"use client";

import React from "react";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";

const Navbar: React.FC = () => {
  const { user } = useUser();
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center py-5 px-2 text-gray-700 hover:text-gray-900"
            >
              <svg
                className="h-6 w-6 mr-1 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 11c.917 0 1.683-.276 2.293-.83C15.207 9.462 15.5 8.765 15.5 8c0-.765-.293-1.462-.707-1.67C14.683 6.276 13.917 6 13 6s-1.683.276-2.293.83C10.293 6.538 10 7.235 10 8c0 .765.293 1.462.707 1.67C10.317 9.724 11.083 10 12 10m0-1v2m0 4v2m-6 4v-4a4 4 0 014-4h8a4 4 0 014 4v4"
                />
              </svg>
              <span className="font-bold">Memory Capsule</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex-grow flex justify-end items-center space-x-4">
            <Link
              href="/"
              className="py-5 px-3 text-gray-700 hover:text-gray-900"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="py-5 px-3 text-gray-700 hover:text-gray-900"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="py-5 px-3 text-gray-700 hover:text-gray-900"
            >
              Contact
            </Link>
            <SignedIn>
              {user ? (
                <Link
                  href={`/profile/${user.id}/${user.emailAddresses[0]}`}
                  className="py-5 px-3 text-gray-700 hover:text-gray-900"
                >
                  Profile
                </Link>
              ) : (
                <div className="py-5 px-3 text-gray-700">Profile</div>
              )}
              {/* <Link
                href="/profile"
                className="py-5 px-3 text-gray-700 hover:text-gray-900"
              >
                Profile
              </Link> */}
              <UserButton />
            </SignedIn>
            <SignedOut>
              <Link
                href="/sign-in"
                className="py-2 px-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
              >
                Log In
              </Link>
              <Link
                href="/sign-up"
                className="py-2 px-3 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition duration-300"
              >
                Sign Up
              </Link>
            </SignedOut>
          </div>

          {/* Mobile Button */}
          <div className="md:hidden flex items-center">
            <button className="mobile-menu-button">
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="mobile-menu hidden md:hidden">
        <Link href="/" className="block py-2 px-4 text-sm hover:bg-gray-200">
          Home
        </Link>
        <Link
          href="/about"
          className="block py-2 px-4 text-sm hover:bg-gray-200"
        >
          About
        </Link>
        <SignedIn>
          <Link
            href="/profile"
            className="block py-2 px-4 text-sm hover:bg-gray-200"
          >
            Profile
          </Link>
        </SignedIn>
        <SignedOut>
          <Link
            href="/sign-in"
            className="block py-2 px-4 text-sm hover:bg-gray-200"
          >
            Log In
          </Link>
          <Link
            href="/sign-up"
            className="block py-2 px-4 text-sm hover:bg-gray-200"
          >
            Sign Up
          </Link>
        </SignedOut>
      </div>
    </nav>
  );
};

export default Navbar;
