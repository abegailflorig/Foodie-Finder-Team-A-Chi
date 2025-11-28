import { useState } from "react";
import { supabase } from "../lib/supabaseClient"; 
import { useNavigate } from "react-router";

export default function SignupPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    address: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    const { full_name, email, phone_number, address, password } = formData;

    if (!full_name || !email || !password) {
      alert("Please fill in all required fields!");
      return;
    }

    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    // Insert profile into `profiles` table
    const { error: profileError } = await supabase
      .from("profiles")
      .insert([
        {
          id: data.user.id,
          full_name,
          phone_number,
          address,
        },
      ]);

    if (profileError) {
      alert(profileError.message);
      return;
    }

    alert("Signup successful! Please check your email to confirm.");
    
    // Navigate to login page
    navigate("/login");
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-white overflow-hidden">

      {/* Yellow Header */}
      <div className="absolute top-0 w-full h-[48%] bg-[#FFC533] rounded-b-3xl"></div>

      {/* Page Content */}
      <div className="flex flex-col items-center z-10 w-full px-4 md:px-6">

        {/* Logo */}
        <img
          src="/secondary-logo.png"
          alt="Foodie Finder"
          className="w-32 h-32 md:w-40 md:h-40 mt-4 mb-6"
        />

        {/* Tabs */}
        <div className="flex items-center justify-center gap-8 md:gap-14 text-black font-medium mb-4 md:mb-6">
          <button
            className="pb-1 border-b-2 border-transparent text-black text-lg md:text-xl style-neuton"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
          <div className="w-px h-8 md:h-10 bg-black mx-2"></div>
          <button className="pb-1 border-b-2 border-white text-white text-lg md:text-xl style-neuton">
            Signup
          </button>
        </div>

        {/* Signup Form */}
        <div className="style-neuton bg-white rounded-3xl shadow-xl p-5 md:p-8 w-full max-w-lg border border-[#FFC533]">
          <input
            name="full_name"
            type="text"
            className="w-full mb-4 px-5 py-3 md:py-4 rounded-full border border-[#FFC533] shadow-xl"
            placeholder="Name"
            value={formData.full_name}
            onChange={handleChange}
          />

          <input
            name="email"
            type="email"
            className="w-full mb-4 px-5 py-3 md:py-4 rounded-full border border-[#FFC533] shadow-xl"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            name="phone_number"
            type="tel"
            className="w-full mb-4 px-5 py-3 md:py-4 rounded-full border border-[#FFC533] shadow-xl"
            placeholder="Phone number"
            value={formData.phone_number}
            onChange={handleChange}
          />

          <input
            name="password"
            type="password"
            className="w-full mb-4 px-5 py-3 md:py-4 rounded-full border border-[#FFC533] shadow-xl"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />

          <input
            name="address"
            type="text"
            className="w-full mb-2 px-5 py-3 md:py-4 rounded-full border border-[#FFC533] shadow-xl"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        {/* Signup Button */}
        <div className="mt-4 md:mt-6 style-neuton w-full flex justify-center">
          <button
            className="w-44 md:w-56 bg-[#FCE8D8] rounded-full border border-[#FFC533] py-2 md:py-3 shadow-xl font-medium hover:bg-yellow-500 transition"
            onClick={handleSignup}
          >
            Signup
          </button>
        </div>

      </div>
    </div>
  );
}
