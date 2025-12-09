import { House, MapPin, Heart, CircleUserRound } from "lucide-react";
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

  // ⭐ Full + Half Star Renderer
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

  // Search restaurants by menu item or name/address
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
      <div className="px-4 pt-4">
        <input
          type="text"
          placeholder="Search Restaurant or Menu Item"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full text-[16px] sm:text-[18px] px-4 py-2 sm:py-3 border border-[#FFC533] rounded-full bg-white shadow-md outline-none"
        />
      </div>

      {/* Restaurant List */}
      <div className="px-4 mt-4 flex-1">
        <h2 className="text-[20px] sm:text-[30px] font-semibold style-neuton mb-3">
          All Restaurants
        </h2>

        <div className="space-y-4 pb-28">
          {restaurants.length === 0 ? (
            <p className="text-gray-500 text-sm sm:text-base">No restaurants found.</p>
          ) : (
            restaurants.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-t-[#FCE8D8] border-[#CFB53C] drop-shadow-[0_6px_2px_#CFB53C] p-3 flex gap-3 w-full cursor-pointer"
                onClick={() => navigate(`/restaurant/${item.id}`)}
              >
                {/* Restaurant Image */}
                <img
                  src={getImageUrl(item.image_url)}
                  alt={item.name}
                  className="w-38 h-30 sm:w-32 sm:h-32 md:w-96 md:h-36 object-cover rounded-2xl border-b-2 border-[#FFC533] shadow-sm flex-shrink-0"
                  onError={(e) => { e.target.src = "/placeholder/default.png"; }}
                />

                <div className="flex flex-col flex-grow">
                  <h3 className="font-semibold text-[18px] sm:text-[20px] md:text-[28px] style-neuton leading-tight">
                    {item.name}
                  </h3>

                  <p className="text-black text-[10px] sm:text-[14px] md:text-[15px] mt-1 style-poppins">
                    Address: {item.address}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <p className="text-[#FFC533] text-[16px] sm:text-[18px] md:text-[20px] font-medium">
                      {renderStars(item.overall_rating || 0)}
                    </p>

                    <span className="bg-[#CFB53C] text-black px-2 py-[1px] rounded-full text-[12px] sm:text-[14px] md:text-[14px]">
                      reviews
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border border-[#CFB53C] rounded-t-lg shadow-md flex justify-around items-center py-3">
        <button onClick={() => navigate("/")} className="text-black hover:text-[#FFC533]">
          <House size={26} />
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
