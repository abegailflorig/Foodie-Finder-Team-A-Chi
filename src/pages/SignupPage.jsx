import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router";
import { Eye, EyeClosed } from "lucide-react";

export default function SignupPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    address: "",
    password: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle signup
  const handleSignup = async () => {
    const { full_name, email, phone_number, address, password } = formData;

    if (!full_name || !email || !password) {
      alert("Please fill in all required fields!");
      return;
    }

    // Create user in Supabase Auth WITHOUT email confirmation
    const { data, error } = await supabase.auth.signUp(
      {
        email,
        password,
      },
      { emailRedirectTo: null } // Skip confirmation email
    );

    if (error) {
      alert(error.message);
      return;
    }

    const userId = data.user.id;

    // Insert into profiles table
    const { error: profileError } = await supabase.from("profiles").insert([
      {
        id: userId,
        full_name,
        phone_number,
        address,
        role: "user",
      },
    ]);

    if (profileError) {
      alert(profileError.message);
      return;
    }

    alert("Signup successful! You can now log in.");
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
            className="w-full mb-4 px-5 py-3 md:py-4 rounded-full border border-[#FFC533] shadow-xl focus:outline-none"
            placeholder="Name:"
            value={formData.full_name}
            onChange={handleChange}
          />

          <input
            name="email"
            type="email"
            className="w-full mb-4 px-5 py-3 md:py-4 rounded-full border border-[#FFC533] shadow-xl focus:outline-none"
            placeholder="Email:"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            name="phone_number"
            type="tel"
            className="w-full mb-4 px-5 py-3 md:py-4 rounded-full border border-[#FFC533] shadow-xl focus:outline-none"
            placeholder="Phone number:"
            value={formData.phone_number}
            onChange={handleChange}
          />

          {/* PASSWORD WITH SHOW/HIDE ICON */}
          <div className="relative mb-4">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              className="w-full px-5 py-3 md:py-4 rounded-full border border-[#FFC533] shadow-xl focus:outline-none"
              placeholder="Password:"
              value={formData.password}
              onChange={handleChange}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600"
            >
              {showPassword ? (
                <Eye className="h-5 w-5" />
              ) : (
                <EyeClosed className="h-5 w-5" />
              )}
            </button>
          </div>

          <input
            name="address"
            type="text"
            className="w-full mb-2 px-5 py-3 md:py-4 rounded-full border border-[#FFC533] shadow-xl focus:outline-none"
            placeholder="Address:"
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
