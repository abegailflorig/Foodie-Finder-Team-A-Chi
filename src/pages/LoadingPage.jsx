  import { useEffect } from "react";
  import { useNavigate } from "react-router";

  export default function LoadingPage() {
    const navigate = useNavigate();

    useEffect(() => {
      // Show loading for 2 seconds, then redirect to landing
      const timer = setTimeout(() => {
        navigate("/landing", { replace: true });
      }, 2000);

      return () => clearTimeout(timer); // Cleanup timer on unmount
    }, [navigate]);
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
