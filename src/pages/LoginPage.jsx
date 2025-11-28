import React from "react";
import { FaFacebookF, FaGoogle } from "react-icons/fa";
import  { useState } from "react";
import { supabase } from "../lib/supabaseClient"; 
import { useNavigate } from "react-router";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    // Login successful -> redirect to homepage
    navigate("/homepage");
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-white overflow-hidden">

      {/* Yellow Header */}
      <div className="absolute top-0 w-full h-[48%] bg-[#FFC533] rounded-b-3xl"></div>

      {/* Main Content */}
      <div className="flex flex-col items-center z-10 w-full px-4 md:px-6 lg:px-10">

        {/* Logo */}
        <img
          src="/secondary-logo.png"
          alt="Foodie Finder"
          className="w-32 h-32 md:w-40 md:h-40 mt-4 mb-6"
        />

        {/* Tabs */}
        <div className="flex items-center justify-center gap-8 md:gap-14 text-black text-lg md:text-xl style-neuton mb-4 md:mb-6">
          <button className="pb-1 border-b-2 border-white text-white">Login</button>
          <div className="w-px h-8 md:h-10 bg-black mx-2"></div>
          <button className="pb-1 border-b-2 border-transparent text-black" onClick={() => navigate("/signup")}>Signup</button>
        </div>

        {/* Form */}
        <div className="style-neuton bg-white rounded-3xl shadow-xl p-6 md:p-8 w-full max-w-lg border border-[#FFC533] flex flex-col items-center">

          <input
            type="email"
            className="w-full mb-4 md:mb-6 px-5 py-3 md:py-4 rounded-full border border-[#FFC533] shadow-xl focus:outline-none"
            placeholder="Email:"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full mb-2 px-5 py-3 md:py-4 rounded-full border border-[#FFC533] shadow-xl focus:outline-none"
            placeholder="Password:"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Login Button */}
        <button onClick={handleLogin} className="w-40 md:w-52 bg-[#FFC533] rounded-full border border-[#CFB53C] shadow-xl mt-6 py-2 md:py-3 text-lg md:text-xl style-neuton hover:bg-[#CFB53C] transition">
          Login
        </button>

        {/* Social Buttons */}
        <div className="flex flex-col gap-3 w-full max-w-lg mt-6 text-lg md:text-xl style-neuton">

          <button className="flex items-center justify-center gap-4 md:gap-5 bg-[#FFC533] border-[#CFB53C] shadow-xl py-3 rounded-full border hover:bg-[#CFB53C] transition">
            <FaFacebookF /> Continue w/ Facebook
          </button>

          <button className="flex items-center justify-center gap-4 md:gap-5 bg-[#FFC533] border-[#CFB53C] shadow-xl py-3 rounded-full border hover:bg-[#CFB53C] transition">
            <FaGoogle /> Continue w/ Google
          </button>

        </div>

      </div>
    </div>
  );
}
