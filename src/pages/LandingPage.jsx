import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function LandingPage() {
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimate(true), 50);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-white overflow-hidden">

      {/* YELLOW BG - DROP DOWN */}
      <div
        className={`
          absolute top-0 w-full h-1/2 bg-[#FFC533] rounded-b-3xl
          transition-transform duration-700 ease-out
          ${animate ? "translate-y-0" : "-translate-y-full"}
        `}
      ></div>

      {/* CONTENT - LOGO FOLLOWS SAME DIRECTION (DROP DOWN) */}
      <div
        className={`
          flex flex-col items-center z-10 px-6 mt-62
          transition-all duration-700 delay-150
          ${animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-20"}
        `}
      >
        <img
          src="/secondary-logo.png"
          alt="Foodie Finder Logo"
          className="w-40 h-40 mx-auto"
        />

        <div className="text-center mb-10">
          <h1 className="text-4xl font-regular style-neuton">
            All your <br /> Favorite Foods
          </h1>
        </div>

        <div className="mt-10 flex flex-col gap-4 w-60 style-neuton">
          <button
            onClick={() => navigate("/login")}
            className="border border-[#CFB53C] bg-[#FFC533] text-black py-2 rounded-full font-medium hover:bg-yellow-500 transition"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="border border-[#CFB53C] text-black py-2 rounded-full font-medium bg-[#FCE8D8] hover:bg-yellow-50 transition"
          >
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
}
