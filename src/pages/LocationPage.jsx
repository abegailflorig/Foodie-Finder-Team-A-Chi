import { House, MapPin, Heart, CircleUserRound, Menu } from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function LocationPage() {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [query, setQuery] = useState("");

  // Build public URL for images
  const getImageUrl = (path, folder = "restaurant-images") => {
    if (!path) return "/places/placeholder.png";
    if (path.startsWith("http")) return path;
    return `https://ajvlsivsfmtpaogjzaco.supabase.co/storage/v1/object/public/${folder}/${path}`;
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

  // 🔥 Use overall_rating instead of rating
  const filtered = restaurants.filter((r) =>
    (r.name || "").toLowerCase().includes(query.toLowerCase()) ||
    (r.address || "").toLowerCase().includes(query.toLowerCase())
  );

  // ⭐ Full + Half Star Renderer
  const renderStars = (rating = 0) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) stars.push("★");       // full
      else if (rating + 0.5 >= i) stars.push("⯪"); // half
      else stars.push("☆");                   // empty
    }
    return stars.join("");
  };

  return (
    <div className="min-h-screen bg-[#FFFAE2] flex flex-col">
      <div className="px-4 pt-4 flex flex-col items-start">
        <input
          type="text"
          placeholder="Search Restaurant"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full sm:w-full text-[16px] sm:text-[18px] px-4 py-2 sm:py-3 border border-t-[#FCE8D8] border-[#FFC533] rounded-full bg-white shadow-md outline-none"
        />
      </div>

      <div className="px-4 mt-4">
        <h2 className="text-[20px] sm:text-[30px] font-semibold style-neuton mb-3">
          Nearby Restaurant
        </h2>

        <div className="space-y-4 pb-28">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-t-[#FCE8D8] border-[#CFB53C] drop-shadow-[0_6px_2px_#CFB53C] border-b-1 p-3 flex gap-3 w-[full] sm:w-full cursor-pointer"
              onClick={() => navigate(`/restaurant/${item.id}`)}
            >
              <img
                src={getImageUrl(item.image_url)}
                alt={item.name}
                className="w-45 h-25 md:w-82 md:h-32 object-cover border-b-2 border-[#FFC533] rounded-[28px] shadow-sm flex-shrink-0"
                onError={(e) => {
                  e.target.src = "/placeholder/default.png";
                }}
              />

              <div className="flex flex-col flex-grow">
                <h3 className="font-semibold text-[20px] sm:text-[16px] md:text-[30px] style-neuton leading-tight">
                  {item.name}
                </h3>

                <p className="text-black text-[14px] sm:text-[12px] md:text-[16px] ml-2 style-poppins mt-1">
                  Address: {item.address}
                </p>

                {/* ⭐ Rating Display (connected to restaurant.overall_rating) */}
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-[#FFC533] text-[20px] sm:text-[12px] md:text-[20px] font-medium">
                    {renderStars(item.overall_rating || 0)}
                  </p>

                  <span className="bg-[#CFB53C] text-black px-2 py-[1px] rounded-full text-[14px] sm:text-[10px] md:text-[14px]">
                    reviews
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border border-[#CFB53C] rounded-t-lg shadow-md flex justify-around items-center py-3">
        <button onClick={() => navigate("/")} className="text-black hover:text-[#FFC533]">
          <House size={26} />
        </button>

        <button
          onClick={() => navigate("/categoriespage")}
          className="text-black hover:text-[#FFC533]"
        >
          <Menu size={22} />
        </button>

        <button
          onClick={() => navigate("/locationpage")}
          className="text-[#FFC533] hover:text-black"
        >
          <MapPin size={26} />
        </button>

        <button
          onClick={() => navigate("/favoritepage")}
          className="text-black hover:text-[#FFC533]"
        >
          <Heart size={26} />
        </button>

        <button
          onClick={() => navigate("/profilepage")}
          className="text-black hover:text-[#FFC533]"
        >
          <CircleUserRound size={26} />
        </button>
      </div>
    </div>
  );
}
