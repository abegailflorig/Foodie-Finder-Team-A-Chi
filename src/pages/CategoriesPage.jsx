import { House, MapPin, Heart, CircleUserRound, Menu } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";

export default function CategoriesPage() {
  const navigate = useNavigate();

  const [meals, setMeals] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [menuList, setMenuList] = useState([]);
  const [userId, setUserId] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // ------------------------------------------
  // GET CURRENT USER (Supabase v2)
  // ------------------------------------------
  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    }
    fetchUser();
  }, []);

  // ------------------------------------------
  // LOAD MEALS
  // ------------------------------------------
  useEffect(() => {
    async function fetchMeals() {
      const { data, error } = await supabase.from("meals").select("*");
      if (error) console.log(error);
      setMeals(data || []);
    }
    fetchMeals();
  }, []);

  // ------------------------------------------
  // LOAD MENU ITEMS
  // ------------------------------------------
  useEffect(() => {
    if (selectedMeal) {
      fetchMenuByMeal(selectedMeal);
    } else {
      fetchAllMenuItems();
    }
  }, [selectedMeal]);

  // ------------------------------------------
  // FETCH DEFAULT MENU LIST (SHOW ALL MENU ITEMS)
  // ------------------------------------------
  async function fetchAllMenuItems() {
    const { data, error } = await supabase
      .from("menu_items")
      .select(`
        id,
        name,
        price,
        image_url,
        restaurant:restaurants!restaurant_id (
          id,
          name
        )
      `);

    if (error) console.log(error);
    setMenuList(data || []);
  }

  // ------------------------------------------
  // FETCH FILTERED MENU ITEMS BY MEAL
  // ------------------------------------------
  async function fetchMenuByMeal(mealId) {
    const { data, error } = await supabase
      .from("menu_item_meals")
      .select(`
        menu_items (
          id,
          name,
          price,
          image_url,
          restaurant:restaurants!restaurant_id (
            id,
            name
          )
        )
      `)
      .eq("meal_id", mealId);

    if (error) console.log(error);

    const extractedItems = data?.map((x) => x.menu_items);
    setMenuList(extractedItems || []);
  }

  // ------------------------------------------
  // LOAD USER FAVORITES
  // ------------------------------------------
  useEffect(() => {
    if (!userId) return;
    async function fetchFavorites() {
      const { data, error } = await supabase
        .from("favorites")
        .select("menu_item_id")
        .eq("user_id", userId);
      if (error) console.log(error);
      setFavorites(data?.map((f) => f.menu_item_id) || []);
    }
    fetchFavorites();
  }, [userId]);

  // ------------------------------------------
  // TOGGLE FAVORITE
  // ------------------------------------------
  async function toggleFavorite(menuItemId) {
    if (!userId) return;

    if (favorites.includes(menuItemId)) {
      // REMOVE FROM FAVORITE
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", userId)
        .eq("menu_item_id", menuItemId);
      if (error) console.log(error);
      setFavorites(favorites.filter((id) => id !== menuItemId));
    } else {
      // ADD TO FAVORITE
      const { error } = await supabase.from("favorites").insert([
        {
          user_id: userId,
          menu_item_id: menuItemId,
        },
      ]);
      if (error) console.log(error);
      setFavorites([...favorites, menuItemId]);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white px-4 sm:px-6 pt-4 pb-28 sm:pb-24">
      <p className="text-[26px] sm:text-[32px] font-regular style-neuton -mt-1 text-left sm:text-left">
        Find your Favorites Food
      </p>

      {/* SEARCH BAR */}
      <div className="mt-3">
        <input
          placeholder="Search Bar"
          className="text-[18px] sm:text-[20px] style-neuton w-full bg-white border-[2px] border-t-[#FCE8D8] border-[#D7C15B] rounded-full px-4 py-2 outline-none shadow-[0_4px_6px_-1px_rgba(207,181,60,0.5)]"
        />
      </div>

      {/* CATEGORIES */}
      <div className="mt-6 flex flex-col">
        <h2 className="text-2xl sm:text-3xl font-regular text-black-500 mb-2 style-neuton text-left sm:text-left">
          Categories
        </h2>
        <div className="style-neuton flex justify-left gap-4 sm:gap-6 overflow-x-auto px-4 sm:px-6 w-full max-w-4xl pb-2">
          {meals.map((meal) => (
            <div
              key={meal.id}
              onClick={() => setSelectedMeal(meal.id)}
              className="relative flex-shrink-0 bg-white border border-[#FFC533] rounded-full shadow-[0_4px_6px_-1px_rgba(207,181,60,0.5)] 
                transition-transform hover:scale-105 
                w-[110px] sm:w-[200px] 
                h-[55px] sm:h-[80px]"
            >
              <img
                src={meal.image_url}
                alt={meal.name}
                className="w-full h-full object-cover rounded-full opacity-90 blur-[1px]"
              />
              <span className="style-neuton absolute inset-0 flex items-center justify-center font-bold 
                text-s sm:text-sm text-black uppercase 
                [text-shadow:_-1px_-1px_0_white,_1px_-1px_0_white,_-1px_1px_0_white,_1px_1px_0_white]">
                {meal.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* MENU GRID */}
      <div className="grid grid-cols-2 mt-16 sm:mt-20 gap-x-4 sm:gap-x-6 gap-y-1">
        {menuList.map((dish) => (
          <div key={dish.id} className="relative pb-10 sm:pb-12 min-h-[260px] sm:min-h-[300px]">
            <img
              src={dish.image_url}
              alt={dish.name}
              className="absolute top-1 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[110px] sm:w-[130px] h-[110px] sm:h-[130px] object-cover rounded-full shadow-lg bg-white border-2 border-white z-10"
            />

            <div className="bg-[#FFFAE2] border border-x-[2px] border-b-[5px] border-[#CFB53C] shadow-[0_30px_25px_5px_rgba(207,181,60,0.35)] rounded-t-[32px] pt-8 sm:pt-10 pb-4 px-3 flex flex-col min-h-[180px]">
              <p className="font-bold text-black text-[17px] sm:text-[32px] mt-10 style-neuton leading-tight">{dish.name}</p>

              {/* RESTAURANT NAME */}
              <p className="text-s sm:text-[18px] style-poppins text-gray-500 -mt-1 p-1 sm:p-2">
                - {dish.restaurant?.name}
              </p>

              <p className="font-extrabold text-[22px] text-right">
                ₱ {dish.price}.00
              </p>

              <div className="mt-auto flex flex-col items-center gap-1">
                <Heart
                  size={24}
                  className={`mb-[-28px] sm:mb-[-32px] transition-transform hover:scale-110 ${
                    favorites.includes(dish.id) ? "text-[#FF7979] fill-[#FF7979]" : "text-gray-400"
                  }`}
                  onClick={() => toggleFavorite(dish.id)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* BOTTOM NAV */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border rounded-t-lg shadow-md flex justify-around py-2 z-50">
        <button onClick={() => navigate("/homepage")}><House size={26} /></button>
        <button onClick={() => navigate("/categoriespage")} className="text-[#FFC533]"><Menu size={22} /></button>
        <button onClick={() => navigate("/locationpage")}><MapPin size={26} /></button>
        <button onClick={() => navigate("/favoritepage")}><Heart size={26} /></button>
        <button onClick={() => navigate("/profilepage")}><CircleUserRound size={26} /></button>
      </div>
    </div>
  );
}
