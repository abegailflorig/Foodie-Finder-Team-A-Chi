import React from "react";
import { FaFacebookF, FaGoogle } from "react-icons/fa";

export default function LoginPage() {
  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-white overflow-hidden">
    {/* Yellow Header */}
    <div className="absolute top-0 w-full h-1/2 bg-[#FFC533] rounded-b-3xl"></div>

    {/* Page Content */}
    <div className="flex flex-col items-center z-10 mt-0 w-full px-6">
        <img src="/secondary-logo.png" alt="Foodie Finder" className="w-38 h-40 mb-6" />

        {/* Tabs */}
        <div className="flex items-center justify-center gap-10 text-black font-medium mb-6">
        <button className="pb-1 border-b-2 border-white text-white">Login</button>
        <div className="w-px h-10 bg-black mx-2"></div>
        <button className="pb-1 border-b-2 border-transparent text-black">Signup</button>
        </div>

        {/* Form + Button Section */}
        <div className="flex flex-col items-center w-full ">
        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md border border-[#FFC533] flex flex-col items-center ">
            <input
            type="email"
            className="w-full mb-6 px-5 py-3 rounded-full border border-[#FFC533] shadow-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Email"
            />
            <input
            type="password"
            className="w-full mb-2 px-5 py-3 rounded-full border border-[#FFC533] shadow-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Password"
            />
        </div>

        {/* Login Button*/}
        <button className="w-50 bg-[#FFC533]  rounded-full border border-[#CFB53C] shadow-xl mt-6 py-2 px-2  font-medium hover:bg-yellow-500 transition">
            Login
        </button>
        </div>

        {/* Social Buttons */}
        <div className="flex flex-col gap-3 w-full max-w-md mt-6">
        <button className="flex items-center justify-center gap-2 bg-[#FFC533] border-[#CFB53C] shadow-xl py-3 rounded-full border font-medium hover:bg-yellow-500 transition">
            <FaFacebookF /> Continue w/ Facebook
        </button>
        <button className="flex items-center justify-center gap-2 bg-[#FFC533] border-[#CFB53C] shadow-xl py-3 rounded-full border font-medium hover:bg-yellow-500 transition">
            <FaGoogle />  Continue w/ Google
        </button>
        </div>
    </div>
    </div>

  );
}
