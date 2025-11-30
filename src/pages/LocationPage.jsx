import { House, MapPin, Heart, CircleUserRound, Menu } from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function LocationPage() {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [query, setQuery] = useState("");

  // Return correct image URL
  const getImageUrl = (path) => {
    if (!path) return "/places/placeholder.png";

    // If already a full URL (your DB stores full URL), return it
    if (path.startsWith("http")) return path;

    // Otherwise build public storage URL
    return `https://ajvlsivsfmtpaogjzaco.supabase.co/storage/v1/object/public/restaurant-images/${path}`;
  };

  useEffect(() => {
    async function loadRestaurants() {
      const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .order("name");

      if (error) console.log(error);
      setRestaurants(data || []);
    }
    loadRestaurants();
  }, []);

  const filtered = restaurants.filter((r) =>
    (r.name || "").toLowerCase().includes(query.toLowerCase()) ||
    (r.address || "").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FFFAE2] flex flex-col">
      <div className="px-4 pt-4 flex flex-col items-start">
        <input
          type="text"
          placeholder="Search Restaurant"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full text-[16px] sm:text-[18px] px-4 py-2 sm:py-3 border rounded-full bg-white shadow-md outline-none"
        />
      </div>

      <div className="px-4 mt-4">
        <h2 className="text-[18px] sm:text-[20px] font-semibold mb-3">
          Nearby Restaurant
        </h2>

        <div className="space-y-4 pb-28">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border p-3 flex gap-3 shadow-md w-full"
            >
              <img
                src={getImageUrl(item.image_url)}
                alt={item.name}
                className="w-50 h-25 md:w-82 md:h-32 object-cover border-b-2 border-[#FFC533] rounded-[28px] shadow-sm flex-shrink-0"
                onError={(e) => { e.target.src = "/placeholder/default.png"; }}
              />

              <div className="flex flex-col flex-grow">
                <h3 className="font-semibold text-[14px] sm:text-[16px] md:text-[18px] leading-tight">
                  {item.name}
                </h3>

                <p className="text-black text-[10px] sm:text-[12px] md:text-[14px] mt-1">
                  Address: {item.address}
                </p>

                <p className="text-black text-[10px] sm:text-[12px] md:text-[14px] font-bold mt-1">
                  Get There: —
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <p className="text-[#FFC533] text-[10px] sm:text-[12px] md:text-[14px] font-medium">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span key={i}>
                        {i < Number(item.rating || 0) ? "★" : "☆"}
                      </span>
                    ))}
                  </p>

                  <span className="bg-[#CFB53C] text-black px-2 py-[1px] rounded-full text-[8px] sm:text-[10px] md:text-[12px]">
                    reviews
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border border-[#CFB53C] rounded-t-lg shadow-md flex justify-around items-center py-2">
        <button onClick={() => navigate("/homepage")} className="text-black hover:text-[#FFC533]">
          <House size={26} />
        </button>

        <button onClick={() => navigate("/categoriespage")} className="text-black hover:text-[#FFC533]">
          <Menu size={22} />
        </button>

        <button onClick={() => navigate("/locationpage")} className="text-[#FFC533] hover:text-black">
          <MapPin size={26} />
        </button>

        <button onClick={() => navigate("/favoritepage")} className="text-black hover:text-[#FFC533]">
          <Heart size={26} />
        </button>

        <button onClick={() => navigate("/profilepage")} className="text-black hover:text-[#FFC533]">
          <CircleUserRound size={26} />
        </button>
      </div>
    </div>
  );
}
