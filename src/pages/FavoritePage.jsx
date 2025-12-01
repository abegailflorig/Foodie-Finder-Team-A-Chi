import { useEffect, useState } from "react";
import {  House, Menu, MapPin, Heart, CircleUserRound, Trash2 } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router";

export default function FavoritePage() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  // -----------------------------
  // HELPER FUNCTION: RENDER STARS WITH HALF STARS
  // -----------------------------
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<span key={i} className="text-yellow-400 text-[20px]">★</span>); // full star
      } else if (rating + 0.5 >= i) {
        stars.push(<span key={i} className="text-yellow-400 text-[20px]">⯨</span>); // half star (can replace with SVG)
      } else {
        stars.push(<span key={i} className="text-gray-300 text-sm">☆</span>); // empty star
      }
    }
    return stars;
  };

  // -----------------------------
  // FETCH FAVORITES WITH AVERAGE RATINGS
  // -----------------------------
  async function fetchFavorites() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch favorites and include menu items and their reviews
    const { data, error } = await supabase
      .from("favorites")
      .select(`
        id,
        menu_item_id,
        menu_items (
          id,
          name,
          price,
          discount,
          image_url,
          restaurant_id,
          restaurants (
            id,
            name
          ),
          menu_item_reviews ( rating )
        )
      `)
      .eq("user_id", user.id);

    if (error) return console.error("Fetch favorites error:", error);

    // Compute average rating for each menu item
    const favoritesWithRating = (data || []).map(fav => {
      const reviews = fav.menu_items.menu_item_reviews || [];
      const avgRating = reviews.length
        ? reviews.reduce((sum, r) => sum + parseFloat(r.rating), 0) / reviews.length
        : 0;
      return { ...fav, avgRating };
    });

    setFavorites(favoritesWithRating);
  }

  // -----------------------------
  // DELETE FAVORITE
  // -----------------------------
  async function deleteFavorite(favoriteId) {
    await supabase.from("favorites").delete().eq("id", favoriteId);
    fetchFavorites(); // reload UI
  }

  return (
    <div className="w-full min-h-screen bg-[#FFF9E8] pb-24 overflow-x-hidden">
      {/* HEADER */}
      <div className="bg-[#FFC533] h-48 rounded-b-3xl p-5 relative flex flex-col justify-between">
        <div className="flex justify-between items-start pt-2">
          <div className="w-28 h-28 rounded-full overflow-hidden bg-white flex items-center justify-center shadow-md ml-65 sm:ml-320">
            <img src="secondary-logo.png" alt="Foodie Finder" className="w-full h-full object-contain" />
          </div>
        </div>

        <h1 className="text-[54px] font-['Neuton',sans-serif] -mt-6">Favorites</h1>
      </div>

      {/* FAVORITE ITEMS LIST */}
      <div className="mt-6 space-y-5 pb-20 ml-60 max-[1024px]:ml-20 max-[768px]:ml-5">
        {favorites.length === 0 && (
          <p className="text-center text-gray-600 text-xl mt-10">No favorites yet.</p>
        )}

        {favorites.map((fav) => {
          const item = fav.menu_items;
          const restaurant = item.restaurants;
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
                src={item.image_url}
                alt={item.name}
                className=" bg-white
                  absolute top-1/2 left-0 transform 
                  -translate-x-1/2 -translate-y-1/2 
                  w-38 h-38 object-cover rounded-full shadow-xl 
                  max-[640px]:w-28 max-[640px]:h-28
                  max-[480px]:w-24 max-[480px]:h-24 max-[480px]:left-7  
                  max-[400px]:w-20 max-[400px]:h-20
                "
              />

              {/* CARD CONTENT */}
              <div className="flex-1 pr-14 flex flex-col justify-center max-[480px]:pr-10">
                <p className="font-['Neuton',sans-serif] font-semibold text-[30px] text-black leading-tight max-[480px]:text-[24px]">
                  {item.name}
                </p>

                <p className="text-gray-700 style-poppins text-[20px] font-regular -mt-1 ml-5 max-[480px]:text-[16px]">
                  - {restaurant?.name}
                </p>

                {/* ⭐ STAR RATING WITH HALF STAR */}
                <p className="text-yellow-500 text-sm font-semibold mb-3">
                  {renderStars(rating)}
                </p>

                {/* PRICE ROW */}
                <div className="style-neuton text-[20px] flex items-center mt-2 space-x-2 max-[480px]:text-[16px]">
                  <p className="font-bold text-xl text-black max-[480px]:text-lg">
                    ₱ {item.price}
                  </p>

                  {item.discount > 0 && (
                    <span className="bg-[#CFB53C] text-xs font-bold px-2 py-1 rounded-full text-black">
                      ₱ {item.discount} off
                    </span>
                  )}
                </div>
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
        <button onClick={() => navigate("/categoriespage")} className="text-black hover:text-[#FFC533]">
          <Menu size={22} />
        </button>
        <button onClick={() => navigate("/locationpage")} className="text-black hover:text-[#FFC533]">
          <MapPin size={26} />
        </button>
        <button onClick={() => navigate("/favoritepage")} className="text-[#FFC533] hover:text-black fill-amber-300">
          <Heart size={26} />
        </button>
        <button onClick={() => navigate("/profilepage")} className="text-black hover:text-[#FFC533]">
          <CircleUserRound size={26} />
        </button>
      </div>
    </div>
  );
}
