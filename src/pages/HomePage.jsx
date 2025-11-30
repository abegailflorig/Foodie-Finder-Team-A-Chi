import { useEffect, useState } from "react";
import { House, MapPin, Heart, CircleUserRound, Menu } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router";

export default function HomePage() {
  const navigate = useNavigate();

  const [recommended, setRecommended] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // -------------------------------------
  // LOAD CATEGORIES + DEFAULT MENU ITEMS
  // -------------------------------------
  useEffect(() => {
    loadInitial();
  }, []);

  async function loadInitial() {
    // Load recommendation categories
    const { data: catData, error: catErr } = await supabase
      .from("recommendation")
      .select("*")
      .order("name");

    if (catErr) console.error(catErr);

    setCategories(catData || []);

    // Load default menu_items
    loadDefaultMenuItems();
  }

  // -------------------------------------
  // DEFAULT ALL MENU ITEMS VIEW
  // -------------------------------------
  async function loadDefaultMenuItems() {
    const { data, error } = await supabase
      .from("menu_items")
      .select(`
        id,
        name,
        price,
        discount,
        image_url,
        restaurant:restaurant_id (
          id,
          name,
          image_url,
          rating
        )
      `);

    if (error) {
      console.error(error);
      return setRecommended([]);
    }

    const formatted = (data || []).map((item) => ({
      id: item.id,
      menuItem: item,
      restaurant: item.restaurant,
      discount: item.discount,
    }));

    setRecommended(formatted);
  }

  // -------------------------------------
  // FILTER MENU ITEMS BY recommendation_id
  // -------------------------------------
  async function loadMenuItemsByCategory(categoryId) {
    const { data, error } = await supabase
      .from("menu_item_recommendations")
      .select(`
        menu_item:menu_item_id (
          id,
          name,
          price,
          discount,
          description,
          image_url,
          restaurant:restaurant_id (
            id,
            name,
            image_url,
            rating
          )
        )
      `)
      .eq("recommendation_id", categoryId);

    if (error) {
      console.error(error);
      return setRecommended([]);
    }

    const formatted = (data || []).map((row) => ({
      id: row.menu_item.id,
      menuItem: row.menu_item,
      restaurant: row.menu_item.restaurant,
      discount: row.menu_item.discount,
    }));

    setRecommended(formatted);
  }

  // -------------------------------------
  // LISTEN FOR CATEGORY CHANGE
  // -------------------------------------
  useEffect(() => {
    if (!selectedCategory) loadDefaultMenuItems();
    else loadMenuItemsByCategory(selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* HEADER */}
      <div className="bg-[#FFC533] h-64 sm:h-80 rounded-b-3xl flex flex-col items-center justify-center p-4">
        <div className="relative w-11/12 sm:w-10/12 h-48 sm:h-62 rounded-2xl shadow-md overflow-hidden">
          <img src="/images/banner.jpg" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="relative -mt-6 flex justify-center font-semibold text-lg sm:text-xl text-black style-neuton">
        <input
          type="text"
          placeholder="Search Bar"
          className="w-11/12 sm:w-10/12 bg-white border border-t-[#FCE8D8] border-[#FFC533] rounded-full px-4 py-3 sm:px-5 sm:py-4 shadow-xl focus:outline-none"
        />
      </div>

      {/* RECOMMENDATION CATEGORIES */}
      <div className="mt-6 px-4 sm:px-6 flex gap-4 overflow-x-auto w-full">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className="flex flex-col items-center flex-shrink-0 cursor-pointer"
          >
            <img
              src={cat.image_url || "/images/default-category.png"}
              className="w-18 h-18 sm:w-24 sm:h-20 object-cover rounded-lg opacity-90 border-b-4 border-b-[#FFC533] border-[#FCE8D8] shadow-md"
            />
            <p className="text-xs sm:text-sm mt-1 text-center">{cat.name}</p>
          </div>
        ))}
      </div>

      {/* TITLE */}
      <div className="mt-4 px-4 sm:px-6 flex flex-col">
        <h2 className="text-xl sm:text-2xl font-semibold text-black mb-2 style-neuton">
          {selectedCategory
            ? categories.find((c) => c.id === selectedCategory)?.name
            : "All Menu Items"}
        </h2>

        {/* NO RESULTS */}
        {recommended.length === 0 && (
          <p className="text-gray-500 text-sm">No items found.</p>
        )}

        {/* ITEMS GRID */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 pb-24">
          {recommended.map((rec) => {
            const m = rec.menuItem;
            const r = rec.restaurant;

            return (
              <div
                key={rec.id}
                onClick={() => navigate(`/details/${rec.id}`)}
                className="relative bg-[#FFFAE2] border border-[#FCE8D8] rounded-2xl shadow-md flex flex-col sm:flex-row items-center gap-2 p-2 sm:p-3"
              >
                {/* DISCOUNT BADGE ABOVE PRICE */}
                {rec.discount > 0 && (
                  <span className="absolute sm:top-23 top-62 sm:right-110 font-semibold bg-[#CFB53C] text-black text-xs sm:text-s px-2 py-1 rounded-full shadow-lg z-10">
                    {rec.discount}% OFF
                  </span>
                )}

                <img
                  src={m.image_url || "/images/default-food.png"}
                  className="w-full sm:w-35 h-full object-cover rounded-lg"
                />

                <div className="flex flex-col justify-center text-xs sm:text-sm w-full sm:w-auto mt-2 sm:mt-0">
                  <p className="font-bold text-sm sm:text-base">{m.name}</p>
                  <p className="text-xs text-gray-500">- {r?.name}</p>

                  {/* Rating */}
                  <p className="text-yellow-500 text-xs sm:text-xl mb-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span key={i}>
                        {i < Number(r?.rating || 0) ? "★" : "☆"}
                      </span>
                    ))}
                  </p>

                  {/* PRICE WITH DISCOUNT APPLIED */}
                  {rec.discount > 0 ? (
                    <div>
                      <p className="line-through text-gray-400">
                        ₱{m.price}
                      </p>
                      <p className="font-semibold text-red-600 text-base">
                        ₱{(m.price - (m.price * rec.discount) / 100).toFixed(2)}
                      </p>
                    </div>
                  ) : (
                    <p className="font-semibold mt-4 sm:mt-3">₱{m.price}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* BOTTOM NAV */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border border-[#CFB53C] rounded-t-lg shadow-md flex justify-around items-center py-2">
        <button onClick={() => navigate("/homepage")} className="text-[#FFC533]">
          <House size={26} />
        </button>
        <button onClick={() => navigate("/categoriespage")} className="text-black hover:text-[#FFC533]">
          <Menu size={22} />
        </button>
        <button onClick={() => navigate("/locationpage")} className="text-black hover:text-[#FFC533]">
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
