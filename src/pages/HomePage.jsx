import { useEffect, useState } from "react";
import { House, MapPin, Heart, CircleUserRound, Menu } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router";

export default function HomePage() {
  const navigate = useNavigate();

  const [recommended, setRecommended] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Search states
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    loadInitial();
  }, []);

  async function loadInitial() {
    const { data: catData, error: catErr } = await supabase
      .from("recommendation")
      .select("*")
      .order("name");

    if (catErr) console.error(catErr);
    setCategories(catData || []);

    loadRecommendedMenuItems();
  }

  // 🔍 SEARCH MENU ITEMS + RESTAURANTS
  async function searchAll(keyword) {
    if (!keyword || keyword.trim() === "") {
      setSearchResults([]);
      return;
    }

    // Search MENU ITEMS
    const { data: menuItems, error: menuErr } = await supabase
      .from("menu_items")
      .select(`
        id,
        name,
        description,
        price,
        discount,
        image_url,
        restaurant:restaurant_id (
          id,
          name,
          image_url
        ),
        menu_item_reviews ( rating )
      `)
      .ilike("name", `%${keyword}%`);

    if (menuErr) console.error(menuErr);

    const menuFormatted = (menuItems || []).map((m) => {
      const ratings = m.menu_item_reviews || [];
      const avg = ratings.length
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : 0;

      return {
        type: "menu",
        id: m.id,
        menuItem: { ...m, avg_rating: avg },
        restaurant: m.restaurant,
        discount: m.discount || 0,
      };
    });

    // Search RESTAURANTS
    const { data: restData, error: restErr } = await supabase
      .from("restaurants")
      .select("id, name, address, image_url")
      .ilike("name", `%${keyword}%`);

    if (restErr) console.error(restErr);

    const restFormatted = (restData || []).map((r) => ({
      type: "restaurant",
      ...r,
    }));

    // Combine — menu items FIRST
    setSearchResults([...menuFormatted, ...restFormatted]);
  }

  async function loadRecommendedMenuItems() {
    const { data, error } = await supabase
      .from("menu_item_recommendations")
      .select(`
        score,
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
            image_url
          ),
          menu_item_reviews (
            rating
          )
        )
      `)
      .gt("score", 0)
      .order("score", { ascending: false })
      .limit(20);

    if (error) {
      console.error(error);
      return setRecommended([]);
    }

    const formatted = (data || []).map((row) => {
      const item = row.menu_item;
      const ratings = item.menu_item_reviews || [];
      const avg = ratings.length
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : 0;

      return {
        id: item.id,
        menuItem: { ...item, avg_rating: avg },
        restaurant: item.restaurant,
        discount: row.discount || 0,
        score: row.score,
      };
    });

    setRecommended(formatted);
  }

  async function incrementScore(menuItemId) {
    const { error } = await supabase.rpc("increment_menu_item_score_global", {
      p_menu_item_id: menuItemId,
    });

    if (error) console.error(error);
    loadRecommendedMenuItems();
  }

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
            image_url
          ),
          menu_item_reviews (
            rating
          )
        )
      `)
      .eq("recommendation_id", categoryId);

    if (error) {
      console.error(error);
      return setRecommended([]);
    }

    const formatted = (data || []).map((row) => {
      const item = row.menu_item;
      const ratings = item.menu_item_reviews || [];
      const avg = ratings.length
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : 0;

      return {
        id: item.id,
        menuItem: { ...item, avg_rating: avg },
        restaurant: item.restaurant,
        discount: row.discount || 0,
      };
    });

    setRecommended(formatted);
  }

  useEffect(() => {
    if (!selectedCategory) loadRecommendedMenuItems();
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
      <div className="relative -mt-6 flex justify-center font-regular text-lg sm:text-xl text-black style-neuton">
        <input
          type="text"
          placeholder="Search Bar"
          value={searchKeyword}
          onChange={(e) => {
            const text = e.target.value;
            setSearchKeyword(text);
            searchAll(text);
          }}
          className="w-11/12 sm:w-10/12 bg-white border border-t-[#FCE8D8] border-[#CFB53C] border-b-3 rounded-full px-4 py-3 sm:px-5 sm:py-4 drop-shadow-[0_4px_12px_#CFB53C] focus:outline-none"/>
      </div>

      {/* CATEGORY BAR */}
      <div className="mt-6 px-4 sm:px-6 flex gap-4 overflow-x-auto w-full">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className="flex flex-col items-center flex-shrink-0 cursor-pointer"
          >
            <img
              src={cat.image_url || "/images/default-category.png"}
              className="w-18 h-18 sm:w-24 sm:h-20 object-cover rounded-lg opacity-90 border-b-4 border-b-[#FFC533] border-[#FCE8D8] drop-shadow-[0_1px_2px_#FFC533]"
            />
            <p className="text-xs sm:text-sm mt-1 text-center style-poppins">{cat.name}</p>
          </div>
        ))}
      </div>

      {/* TITLE */}
      <div className="mt-4 px-4 sm:px-6 flex flex-col">
        <h2 className="text-xl sm:text-[32px] font-regular text-black mb-2 style-neuton mt-1">
          {searchKeyword.length > 0
            ? "Search Results"
            : selectedCategory
            ? categories.find((c) => c.id === selectedCategory)?.name
            : "Recommended for You"}
        </h2>

        {/* 🔍 SEARCH RESULTS */}
        {searchKeyword.length > 0 ? (
          searchResults.length === 0 ? (
            <p className="text-gray-500 text-sm">No results found.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 pb-24 cursor-pointer">

              {searchResults.map((item) =>
                item.type === "menu" ? (
                  /*MENU ITEM SEARCH RESULT */
                  <div
                    key={item.id}
                    onClick={() => navigate(`/details/${item.id}`)}
                    className="relative bg-[#FFFAE2] border border-[#FCE8D8] rounded-2xl shadow-md flex flex-col sm:flex-row items-center gap-2 p-2 sm:p-3"
                  >
                    {item.discount > 0 && (
                      <span className="absolute top-2 left-2 bg-[#CFB53C] style-poppins text-black text-xs sm:text-sm px-2 py-1 rounded-full shadow-lg">
                        {item.discount}% off
                      </span>
                    )}

                    <img
                      src={item.menuItem.image_url || "/images/default-food.png"}
                      className="w-full sm:w-35 h-42 sm:h-35 object-cover rounded-lg"
                    />

                    <div className="flex flex-col justify-center text-xs sm:text-sm w-full sm:w-auto mt-2 sm:mt-0">
                      <p className="font-bold text-[25px] sm:text-2xl style-neuton">{item.menuItem.name}</p>
                      <p className="text-[18px] sm:text-sm text-gray-500 style-poppins">
                        - {item.restaurant?.name}
                      </p>

                      {/* ⭐ RATING */}
                      <div className="flex items-center gap-1 mb-1">
                        {Array.from({ length: 5 }, (_, i) => {
                          if (item.menuItem.avg_rating >= i + 1)
                            return <span key={i} className="text-yellow-400 text-[20px]">★</span>;
                          else if (item.menuItem.avg_rating > i && item.menuItem.avg_rating < i + 1)
                            return <span key={i} className="text-yellow-400 text-[20px]">⯨</span>;
                          else return <span key={i} className="text-gray-300 text-sm">☆</span>;
                        })}
                        <p className="text-[15px] text-gray-600 ml-1">
                          ({item.menuItem.avg_rating > 0 ? item.menuItem.avg_rating.toFixed(1) : "No rating"})
                        </p>
                      </div>

                      <p className="text-black text-[15px] sm:text-sm mb-1 line-clamp-2 style-poppins">
                        {item.menuItem.description || "No description available."}
                      </p>

                      {item.discount > 0 ? (
                        <div>
                          <p className="line-through text-gray-400">₱{item.menuItem.price}</p>
                          <p className="font-semibold text-red-600 text-base">
                            ₱{(item.menuItem.price - (item.menuItem.price * item.discount) / 100).toFixed(2)}
                          </p>
                        </div>
                      ) : (
                        <p className="font-regular style-neuton text-[25px] sm:text-[20px] mt-1">₱{item.menuItem.price}</p>
                      )}
                    </div>
                  </div>
                ) : (
                  /* 🏠 RESTAURANT SEARCH RESULT */
                  <div
                    key={item.id}
                    onClick={() => navigate(`/restaurant/${item.id}`)}
                    className="bg-[#FFFAE2] border border-[#FCE8D8] rounded-2xl shadow-md p-3"
                  >
                    <img
                      src={item.image_url || "/images/default-food.png"}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <p className="font-bold text-[22px] sm:text-[25px] mt-2 style-neuton">{item.name}</p>
                    <p className="text-[14px] sm:text-[16px] ml-1 sm:ml-2 text-gray-600">-{item.address}</p>
                  </div>
                )
              )}
            </div>
          )
        ) : (
          /*RECOMMENDED SECTION */
          <div className="grid grid-cols-2 gap-3 sm:gap-4 pb-24 cursor-pointer">
            {recommended.map((rec) => {
          const m = rec.menuItem;
          const r = rec.restaurant;

          const discountedPrice = rec.discount > 0
            ? (m.price - (m.price * rec.discount) / 100).toFixed(2)
            : null;

          return (
            <div
              key={rec.id}
              onClick={() => {
                incrementScore(rec.id);
                navigate(`/details/${rec.id}`);
              }}
              className="relative bg-[#FFFAE2] border border-[#FCE8D8] rounded-2xl shadow-md flex flex-col sm:flex-row items-center gap-2 p-2 sm:p-3"
            >
              {rec.discount > 0 && (
                <span className="absolute top-2 left-2 bg-[#CFB53C] text-black text-xs px-2 py-1 rounded-full shadow-lg">
                  {rec.discount}% OFF
                </span>
              )}

              <img
                src={m.image_url || "/images/default-food.png"}
                className="w-full sm:w-35 h-42 sm:h-35 object-cover rounded-lg"
              />

              <div className="flex flex-col justify-center text-xs sm:text-sm w-full sm:w-auto mt-2 sm:mt-0">
                <p className="font-bold text-[25px] sm:text-2xl style-neuton">{m.name}</p>
                <p className="text-[18px] sm:text-sm text-gray-500 style-poppins font-medium">- {r?.name}</p>

                {/* ⭐ Rating */}
                <div className="flex items-center gap-1 mb-1">
                  {Array.from({ length: 5 }, (_, i) => {
                    if (m.avg_rating >= i + 1)
                      return <span key={i} className="text-yellow-400 text-[20px]">★</span>;
                    else if (m.avg_rating > i && m.avg_rating < i + 1)
                      return <span key={i} className="text-yellow-400 text-[20px]">⯨</span>;
                    else return <span key={i} className="text-gray-300 text-sm">☆</span>;
                  })}
                  <p className="text-[15px] text-gray-600 ml-1">
                    ({m.avg_rating > 0 ? m.avg_rating.toFixed(1) : "No rating"})
                  </p>
                </div>

                <p className="text-black text-[15px] sm:text-sm mb-1 line-clamp-2">
                  {m.description}
                </p>

                {/* PRICE */}
                {discountedPrice ? (
                  <div>
                    <p className="line-through text-gray-400">₱{m.price.toFixed(2)}</p>
                    <p className="font-semibold text-red-600 text-base">₱{discountedPrice}</p>
                  </div>
                ) : (
                  <p className="font-regular style-neuton text-[25px] sm:text-[20px]">₱{m.price.toFixed(2)}</p>
                )}
              </div>
            </div>
          );
        })}
          </div>
        )}
      </div>

      {/* NAVIGATION */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border border-[#CFB53C] rounded-t-lg shadow-md flex justify-around items-center py-3">
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
