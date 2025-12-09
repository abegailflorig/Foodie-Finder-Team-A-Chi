import { House, MapPin, Heart, CircleUserRound, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("User not logged in", userError);
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return;
    }

    setProfile(data);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // Clear sessionStorage flag so location popup will show next login
    sessionStorage.removeItem("locationPopupShown");
    // Redirect to landing page
    window.location.href = "/landing";
  };

  return (
    <div className="w-full min-h-screen bg-[#FFF9E8] overflow-y-auto font-sans pb-24">

      {/* HEADER */}
      <div className="bg-[#FFC533] h-48 rounded-b-3xl p-5 relative flex items-start"></div>

      {/* PROFILE IMAGE */}
<div className="w-full flex justify-center relative">
  <div className="w-32 h-35 sm:w-40 sm:h-38 rounded-full overflow-hidden border-4 border-white shadow-lg -mt-14 z-10">
    <img
      src={
        profile?.image_url
          ? (profile.image_url.startsWith("http")
              ? profile.image_url
              : `https://ajvlsivsfmtpaogjzaco.supabase.co/storage/v1/object/public/profile-images/${profile.image_url}`
            )
          : "/images/profile.jpg"
      }
      alt="profile"
      className="w-full h-full object-cover"
    />
  </div>
</div>


      {/* WHITE INFO CARD */}
      <div className="relative mx-6 mt-6 bg-white p-6 rounded-xl shadow-md border-l-[6px] border-[#FFC533]">
        <div className="absolute right-[-20px] top-6 text-[#FFC533] text-5xl rotate-12 select-none">✦</div>

        <p className="font-semibold text-lg mb-3">{profile?.full_name || "User"}</p>
        <p className="font-semibold text-lg mb-3">{profile?.role ? profile.role.toUpperCase() : "USER"}</p>

        <p className="font-semibold mt-4">Address :</p>
        <p className="text-gray-700 -mt-1 mb-3">{profile?.address || "Not provided"}</p>
      </div>

      {/* LOGOUT BUTTON */}
      <div className="w-full flex justify-left mt-8 p-5">
        <button
          onClick={handleLogout}
          className="px-10 py-2 rounded-full bg-[#FCE8D8] shadow border border-[#CFB53C] text-lg"
        >
          Logout
        </button>
      </div>

      {/* NAVIGATION */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border border-[#CFB53C] rounded-t-lg shadow-md flex justify-around items-center py-3">
        <button onClick={() => navigate("/homepage")} className="text-black hover:text-[#FFC533]"><House size={26} /></button>
        <button onClick={() => navigate("/locationpage")} className="text-black hover:text-[#FFC533]"><MapPin size={26} /></button>
        <button onClick={() => navigate("/favoritepage")} className="text-black hover:text-[#FFC533]"><Heart size={26} /></button>
        <button onClick={() => navigate("/profilepage")} className="text-[#FFC533] hover:text-black"><CircleUserRound size={26} /></button>
      </div>
    </div>
  );
}
