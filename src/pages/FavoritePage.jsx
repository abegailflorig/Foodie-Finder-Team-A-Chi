import { useEffect, useState } from "react"; 
import { House, Menu, MapPin, Heart, CircleUserRound, Trash2 } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router";

export default function FavoritePage() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  // ⭐ Render stars with half stars
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) stars.push(<span key={i} className="text-yellow-400 text-[20px]">★</span>);
      else if (rating + 0.5 >= i) stars.push(<span key={i} className="text-yellow-400 text-[20px]">⯨</span>);
      else stars.push(<span key={i} className="text-gray-300 text-[20px]">☆</span>);
    }
    return stars;
  };

  // ⭐ Fetch favorite restaurants
  async function fetchFavorites() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("favorites")
      .select(`
        id,
        restaurants (
          id,
          name,
          address,
          image_url,
          overall_rating,
          rating_count
        )
      `)
      .eq("user_id", user.id);

    if (error) return console.error("Fetch favorites error:", error);

    const favoritesWithRating = (data || []).map(fav => {
      const restaurant = fav.restaurants;
      const avgRating = restaurant.rating_count
        ? restaurant.overall_rating / restaurant.rating_count
        : 0;
      return { ...fav, avgRating };
    });

    setFavorites(favoritesWithRating);
  }

  // ⭐ Delete favorite
  async function deleteFavorite(favoriteId) {
    await supabase.from("favorites").delete().eq("id", favoriteId);
    fetchFavorites();
  }

  // ⭐ Get restaurant image URL
  const getImageUrl = (path) => {
    if (!path) return "/places/placeholder.png";
    if (path.startsWith("http")) return path;
    return `https://ajvlsivsfmtpaogjzaco.supabase.co/storage/v1/object/public/restaurant-images/${path}`;
  };

  return (
    <div className="w-full min-h-screen bg-[#FFF9E8] pb-28 overflow-x-hidden">
      {/* HEADER */}
      <div className="bg-[#FFC533] h-48 rounded-b-3xl p-5 relative flex flex-col justify-between">
        <div className="flex justify-between items-start pt-2">
          <div className="w-28 h-28 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-white flex items-center justify-center shadow-md ml-65 sm:ml-20">
            <img src="secondary-logo.png" alt="Foodie Finder" className="w-full h-full object-contain" />
          </div>
        </div>
        <h1 className="text-[54px] sm:text-[36px] font-['Neuton',sans-serif] -mt-6">Favorites</h1>
      </div>

      {/* FAVORITE RESTAURANTS LIST */}
      <div className="mt-6 space-y-5 pb-20 ml-60 max-[1024px]:ml-20 max-[768px]:ml-10 max-[480px]:ml-5">
        {favorites.length === 0 && (
          <p className="text-center text-gray-600 text-xl mt-10">No favorites yet.</p>
        )}

        {favorites.map((fav) => {
          const restaurant = fav.restaurants;
          const rating = fav.avgRating || 0;

          return (
            <div
              key={fav.id}
              className="
                relative bg-white rounded-l-[20px] p-3 pl-28 flex items-stretch 
                shadow border-b-4 border-white border-b-[#CFB53C]  
                shadow-[0_10px_10px_-2px_rgba(207,181,60,0.6)]
                max-[640px]:pl-24 max-[480px]:pl-20 max-[400px]:pl-16
              "
            >
              {/* FLOATING IMAGE */}
              <img
                src={getImageUrl(restaurant.image_url)}
                alt={restaurant.name}
                className="
                  absolute top-1/2 left-0 transform 
                  -translate-x-1/2 -translate-y-1/2 
                   w-30 h-34 sm:w-38 sm:h-35 md:w-65 md:h-32 ml-10 sm:ml-15 md:ml-1 object-cover rounded-2xl border-b-3 border-[#CFB53C] shadow-lg flex-shrink-0
                "
              />

              {/* CARD CONTENT */}
              <div className="flex-1 pr-14 flex flex-col justify-center max-[480px]:pr-10">
                <p className="font-['Neuton',sans-serif] font-semibold text-[30px] sm:text-[22px] text-black leading-tight max-[480px]:text-[20px] ml-10 sm:ml-10 md:ml-8">
                  {restaurant.name}
                </p>

                <p className="text-gray-700 style-poppins text-[20px] sm:text-[16px] font-regular -mt-1 ml-11 sm:ml-10 md:ml-10 max-[480px]:text-[14px]">
                  {restaurant.address}
                </p>

                {/* ⭐ STAR RATING */}
                <p className="text-yellow-500 text-sm font-semibold mb-3 ml-9 sm:ml-10 md:ml-8">
                  {renderStars(rating)}
                </p>
              </div>

              {/* DELETE BUTTON */}
              <button
                onClick={() => deleteFavorite(fav.id)}
                className="
                  absolute top-1/2 right-4 transform -translate-y-1/2 
                  bg-[#CFB53C] w-10 h-10 rounded-lg flex items-center justify-center 
                  shadow-md hover:bg-yellow-600 transition
                  max-[480px]:w-9 max-[480px]:h-9
                "
              >
                <Trash2 size={20} className="text-black" />
              </button>
            </div>
          );
        })}
      </div>

      {/* NAVIGATION */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border border-[#CFB53C] rounded-t-lg shadow-md flex justify-around items-center py-3">
        <button onClick={() => navigate("/homepage")} className="text-black hover:text-[#FFC533]">
          <House size={26} />
        </button>
        <button onClick={() => navigate("/locationpage")} className="text-black hover:text-[#FFC533]">
          <MapPin size={26} />
        </button>
        <button onClick={() => navigate("/favoritepage")} className="text-[#FFC533] hover:text-black">
          <Heart size={26} />
        </button>
        <button onClick={() => navigate("/profilepage")} className="text-black hover:text-[#FFC533]">
          <CircleUserRound size={26} />
        </button>
      </div>
    </div>
  );
}
