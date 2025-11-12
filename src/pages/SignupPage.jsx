import React from "react";

export default function SignupPage() {
  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-white overflow-hidden">
      {/* Yellow Header */}
      <div className="absolute top-0 w-full h-1/2 bg-[#FFC533] rounded-b-3xl"></div>

      {/* Page Content */}
      <div className="flex flex-col items-center z-10 mt-0 w-full px-6">
        <img src="/secondary-logo.png" alt="Foodie Finder" className="w-38 h-40 mb-6" />

        {/* Tabs */}
        <div className="flex items-center justify-center gap-10 text-black font-medium mb-6">
          <button className="pb-1 border-b-2 border-transparent text-black">Login</button>
          <div className="w-px h-10 bg-black mx-2"></div>
          <button className="pb-1 border-b-2 border-white text-white">Signup</button>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md border border-[#FFC533]">
          <input
            type="text"
            className="w-full mb-4 px-5 py-3 rounded-full border border-[#FFC533] shadow-xl"
            placeholder="Name:"
          />
          <input
            type="email"
            className="w-full mb-4 px-5 py-3 rounded-full border border-[#FFC533] shadow-xl"
            placeholder="Email:"
          />
          <input
            type="tel"
            className="w-full mb-4 px-5 py-3 rounded-full border border-[#FFC533] shadow-xl"
            placeholder="Phone number:"
          />
          <input
            type="password"
            className="w-full mb-4 px-5 py-3 rounded-full border border-[#FFC533] shadow-xl"
            placeholder="Password:"
          />
          <input
            type="text"
            className="w-full mb-2 px-5 py-3 rounded-full border border-[#FFC533] shadow-xl"
            placeholder="Address:"
          />
        </div>

        {/* Signup Button */}
        <div className="mt-2">
          <button className="w-56 bg-[#FCE8D8] rounded-full border border-[#FFC533] py-2  shadow-xl font-medium hover:bg-yellow-500 transition">
            Signup
          </button>
        </div>
      </div>
    </div>
  );
}
