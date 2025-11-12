import React from "react";

export default function LoadingPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-[#FFC533]">
      <div className="flex flex-col items-center">
        <img
          src="/primary-logo.png"
          alt="Foodie Finder Logo"
          className="w-38 h-40 animate-bounce"
        />
      </div>
    </div>
  );
}
