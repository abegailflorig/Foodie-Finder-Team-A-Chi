import { useEffect, useState } from "react";
import { House, MapPin, Heart, CircleUserRound, Menu } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router";

export default function HomePage() {
  const navigate = useNavigate();

  const [recommended, setRecommended] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    { file: "pizza", category: "Pizza" },
    { file: "spaghetti", category: "Spaghetti" },
    { file: "cakes", category: "Cakes" },
    { file: "pasta", category: "Pasta" },
    { file: "fried chicken", category: "Fried Chicken" },
    { file: "steak", category: "Steak" },
  ];

  // 🔥 FETCH DEFAULT AI RECOMMENDATIONS
  async function loadDefaultRecommendations() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) return;

    const user_id = session.user.id;

    const { data, error } = await supabase
      .from("recommendations")
      .select(
        `
          id,
          score,
          restaurants (
            id,
            name,
            image_url,
            rating,
            price_min,
            price_max,
            category
          )
        `
      )
      .eq("user_id", user_id)
      .order("score", { ascending: false });

    if (error) {
      console.error("Recommendation error:", error);
      return;
    }

    setRecommended(data);
  }

  // 🍕 FETCH CATEGORY-BASED RECOMMENDATIONS
  async function loadCategoryRecommendations(categoryName) {
    const { data, error } = await supabase
      .from("restaurants")
      .select("*, rating, price_min, price_max")
      .eq("category", categoryName);

    if (error) {
      console.error("Category load error:", error);
      return;
    }

    // Convert data to same structure as recommendations table
    const formatted = data.map((item) => ({
      id: item.id,
      score: null,
      restaurants: item,
    }));

    setRecommended(formatted);
  }

  // Runs ONCE on page load
  useEffect(() => {
    loadDefaultRecommendations();
  }, []);

  // RUN WHEN CATEGORY CHANGES
  useEffect(() => {
    if (selectedCategory) {
      loadCategoryRecommendations(selectedCategory);
    } else {
      loadDefaultRecommendations();
    }
  }, [selectedCategory]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* HEADER SECTION */}
      <div className="bg-[#FFC533] h-64 sm:h-80 rounded-b-3xl flex flex-col items-center justify-center p-4">
        <div className="relative w-11/12 sm:w-10/12 h-48 sm:h-62 rounded-2xl shadow-md overflow-hidden">
          <img
            src="/images/banner.jpg"
            alt="Foodie Finder Banner"
            className="w-full h-full object-cover"
          />
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

      {/* CATEGORIES */}
      <div className="mt-6 px-4 sm:px-6 flex gap-4 overflow-x-auto w-full">
        {categories.map(({ file, category }) => (
          <div
            key={file}
            onClick={() => setSelectedCategory(category)}
            className={`flex flex-col items-center flex-shrink-0 cursor-pointer ${
              selectedCategory === category ? "opacity-100" : "opacity-80"
            }`}
          >
            <img
              src={`/browse/${file}.jpg`}
              alt={category}
              className="w-16 h-14 sm:w-24 sm:h-20 object-cover rounded-lg border-b-4 border-b-[#FFC533] border-[#FCE8D8] shadow-md"
            />
            <p className="text-xs sm:text-sm mt-1 text-center">{category}</p>
          </div>
        ))}
      </div>

      {/* RECOMMENDED SECTION */}
      <div className="mt-4 px-4 sm:px-6 flex flex-col">
        <h2 className="text-xl sm:text-2xl font-semibold text-black mb-2 style-neuton">
          {selectedCategory
            ? `Recommended for "${selectedCategory}"`
            : "Recommended for You"}
        </h2>

        {recommended.length === 0 && (
          <p className="text-gray-500 text-sm">No recommendations found.</p>
        )}

        <div className="grid grid-cols-2 gap-3 sm:gap-4 pb-24">
          {recommended.map((rec) => {
            const restaurant = rec.restaurants;

            return (
              <div
                key={rec.id}
                className="bg-[#FFFAE2] border border-[#FCE8D8] rounded-2xl shadow-md flex flex-col items-center gap-2 p-2 sm:p-3"
              >
                <img
                  src={restaurant.image_url || "/images/default-food.png"}
                  alt={restaurant.name}
                  className="w-full sm:w-32 h-32 sm:h-28 object-cover rounded-lg"
                />

                <div className="flex flex-col justify-center text-xs sm:text-sm w-full sm:w-auto">
                  <p className="font-bold text-sm sm:text-base">{restaurant.name}</p>

                  <p className="text-yellow-500 text-xs sm:text-xl mb-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span key={i}>{i < restaurant.rating ? "★" : "☆"}</span>
                    ))}
                  </p>

                  <p className="font-semibold text-black text-sm sm:text-base">
                    ₱ {restaurant.price_min} - ₱ {restaurant.price_max}
                  </p>

                  {!selectedCategory && (
                    <p className="text-gray-700 text-xs">
                      AI Score: {rec.score?.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* BOTTOM NAVIGATION */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border border-[#CFB53C] rounded-t-lg shadow-md flex justify-around items-center py-2">
        <button onClick={() => navigate("/homepage")} className="text-[#FFC533]">
          <House size={26} />
        </button>
        <button onClick={() => navigate("/categoriespage")} className="text-black">
          <Menu size={22} />
        </button>
        <button onClick={() => navigate("/locationpage")} className="text-black">
          <MapPin size={26} />
        </button>
        <button onClick={() => navigate("/favoritepage")} className="text-black">
          <Heart size={26} />
        </button>
        <button onClick={() => navigate("/profilepage")} className="text-black">
          <CircleUserRound size={26} />
        </button>
      </div>
    </div>
  );
}
