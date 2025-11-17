import { House, MapPin, Heart, CircleUserRound } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="w-full h-full bg-[#FFF9E8] overflow-y-auto font-sans pb-24">
      {/* HEADER */}
      <div className="bg-[#FFC533] h-48 rounded-b-3xl p-5 relative flex items-start">
        <button className="text-2xl">←</button>
      </div>

      {/* PROFILE IMAGE */}
      <div className="w-full flex justify-center -mt-16">
        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg">
          <img
            src="/profile.jpg" 
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* WHITE INFO CARD */}
      <div className="relative mx-6 mt-6 bg-white p-6 rounded-xl shadow-md border-l-[6px] border-[#FFC533]">
        {/* Decorative star */}
        <div className="absolute right-[-20px] top-6 text-[#FFC533] text-5xl rotate-12 select-none">
          ✦
        </div>

        <p className="font-semibold text-lg mb-3">Home</p>
        <p className="font-semibold text-lg mb-3">Favorites</p>

        <p className="font-semibold mt-4">Address :</p>
        <p className="text-gray-700 -mt-1 mb-3">San Miguel, Iligan City</p>

        <p className="font-semibold">Contact # :</p>
        <p className="text-gray-700 -mt-1">09752609830</p>
      </div>

      {/* LOGOUT BUTTON */}
      <div className="w-full flex justify-center mt-8">
        <button className="px-10 py-2 rounded-full bg-white shadow border border-gray-300 text-lg">
          Logout
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-yellow-300 rounded-t-3xl shadow-md flex justify-around items-center py-2">
        <button className="text-yellow-500">
          <House size={22} />
        </button>
        <button className="text-gray-500 hover:text-yellow-500 transition">
          <MapPin size={22} />
        </button>
        <button className="text-gray-500 hover:text-yellow-500 transition">
          <Heart size={22} />
        </button>
        <button className="text-gray-500 hover:text-yellow-500 transition">
          <CircleUserRound size={22} />
        </button>
      </div>
    </div>
  );
}
