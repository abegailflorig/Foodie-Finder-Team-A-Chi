import { House, MapPin, Heart, CircleUserRound } from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function LocationPage() {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [query, setQuery] = useState("");

  const getImageUrl = (path, folder = "restaurant-images") => {
    if (!path) return "/places/placeholder.png";
    if (path.startsWith("http")) return path;
    return `https://ajvlsivsfmtpaogjzaco.supabase.co/storage/v1/object/public/${folder}/${path}`;
  };

  const renderStars = (rating = 0) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) stars.push("★");
      else if (rating + 0.5 >= i) stars.push("⯪");
      else stars.push("☆");
    }
    return stars.join("");
  };

  useEffect(() => {
    loadRestaurants();
  }, []);

  async function loadRestaurants() {
    const { data, error } = await supabase
      .from("restaurants")
      .select("*")
      .order("name");
    if (error) console.error(error);
    setRestaurants(data || []);
  }

  useEffect(() => {
    async function searchRestaurants() {
      if (!query || query.trim() === "") {
        loadRestaurants();
        return;
      }

      const { data: menuMatches } = await supabase
        .from("restaurant_menus")
        .select("restaurant_id")
        .ilike("item_name", `%${query}%`);

      const matchedIds = menuMatches?.map((m) => m.restaurant_id) || [];

      const orQueryParts = [];
      if (matchedIds.length > 0) orQueryParts.push(`id.in.(${matchedIds.join(",")})`);
      orQueryParts.push(`name.ilike.%${query}%`);
      orQueryParts.push(`address.ilike.%${query}%`);

      const { data: restaurantData, error: restErr } = await supabase
        .from("restaurants")
        .select("*")
        .or(orQueryParts.join(","))
        .order("name");

      if (restErr) console.error(restErr);
      setRestaurants(restaurantData || []);
    }

    searchRestaurants();
  }, [query]);

  return (
    <div className="min-h-screen bg-[#FFFAE2] flex flex-col">

      {/* Search Input */}
      <div className="px-3 sm:px-4 pt-4">
        <input
          type="text"
          placeholder="Search Restaurant or Menu Item"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full text-[14px] sm:text-[16px] md:text-[18px] px-3 sm:px-4 py-2 sm:py-3  border border-[#FFC533] rounded-full bg-white shadow-md outline-none"
        />
      </div>

      {/* Restaurant List */}
      <div className="px-3 sm:px-4 mt-4 flex-1">
        <h2 className="text-[18px] sm:text-[24px] md:text-[32px] font-semibold style-neuton mb-3">
          All Restaurants
        </h2>

        <div className="space-y-4 pb-28">
          {restaurants.length === 0 ? (
            <p className="text-gray-500 text-[12px] sm:text-[14px] md:text-[16px]">
              No restaurants found.
            </p>
          ) : (
            restaurants.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-t-[#FCE8D8] border-[#CFB53C] drop-shadow-[0_4px_2px_#CFB53C] p-3 flex gap-3 w-full cursor-pointer"
                onClick={() => navigate(`/restaurant/${item.id}`)}
              >
                {/* Restaurant Image */}
                <img
                  src={getImageUrl(item.image_url)}
                  alt={item.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-75 lg:h-36 object-cover rounded-2xl border-b-2 border-[#FFC533] shadow-sm flex-shrink-0"
                  onError={(e) => { e.target.src = "/placeholder/default.png"; }}
                />

                <div className="flex flex-col flex-grow">
                  <h3 className="font-semibold text-[14px] sm:text-[16px] md:text-[20px] lg:text-[28px] style-neuton leading-tight">
                    {item.name}
                  </h3>

                  <p className="text-black text-[10px] sm:text-[12px] md:text-[14px] lg:text-[16px] mt-1 style-poppins">
                    Address: {item.address}
                  </p>

                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <p className="text-[#FFC533] text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-medium">
                      {renderStars(item.overall_rating || 0)}
                    </p>

                    <span className="bg-[#CFB53C] text-black px-2 py-[1px] rounded-full text-[10px] sm:text-[12px] md:text-[14px]">
                      reviews
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* NAVIGATION */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#CFB53C] rounded-t-lg shadow-md flex justify-around items-center py-3 px-2 safe-area-bottom">
              <button onClick={() => navigate("/homepage")}>
                <House size={26} />
              </button>
              <button onClick={() => navigate("/locationpage")}className="text-[#FFC533]">
                <MapPin size={26} />
              </button>
              <button onClick={() => navigate("/favoritepage")}>
                <Heart size={26} />
              </button>
              <button onClick={() => navigate("/profilepage")}>
                <CircleUserRound size={26} />
              </button>
            </div>
    </div>
  );
}
