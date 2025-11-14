import { Home, MapPin, Heart, CircleUserRound } from "lucide-react";

export default function CategoriesPage() {
  const dishes = [
    {
      name: "Lumpia Shanghai",
      shop: "Ah mei's Kitchen",
      price: "₱ 295.00",
      img: "/lumpia.png",
      rating: 4,
    },
    {
      name: "Lumsilog",
      shop: "Mui’s cupsilog",
      price: "₱ 45.00",
      img: "/lumsilog.png",
      rating: 4,
    },
    {
      name: "Kangkong with Pork",
      shop: "The Pantry Iligan",
      price: "₱ 95.00",
      img: "/kangkong.png",
      rating: 3,
    },
    {
      name: "Tortang Talong",
      shop: "La Fang Homegrown Gourmet",
      price: "₱ 35.00",
      img: "/tortang.png",
      rating: 4,
    },
    {
      name: "Bibimbap",
      shop: "Ah Mei’s Kitchen",
      price: "₱ 185.00",
      img: "/bimbap.png",
      rating: 4,
    },
    {
      name: "Ampalaya with egg",
      shop: "SUOK Bistro",
      price: "₱ 79.00",
      img: "/ampalaya.png",
      rating: 4,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white px-6 pt-4 pb-24">

      {/* GREETING */}
      <p className="text-sm">Hi, Chinley</p>
      <p className="text-xl font-bold -mt-1">Find your Favorites Food</p>

      {/* SEARCH BAR */}
      <div className="mt-3">
        <input
          placeholder="Search Bar"
          className="w-full bg-white border border-yellow-300 rounded-full px-4 py-2 shadow-sm outline-none"
        />
      </div>

      {/* CATEGORIES LABEL */}
      <p className="mt-4 mb-2 font-semibold text-lg">Categories</p>

      {/* CATEGORY BUTTONS */}
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-white border border-yellow-400 rounded-full px-4 py-1 text-sm shadow">
          Breakfast
        </div>
        <div className="bg-white border border-yellow-400 rounded-full px-4 py-1 text-sm shadow">
          Lunch
        </div>
        <div className="bg-white border border-yellow-400 rounded-full px-4 py-1 text-sm shadow">
          Dinner
        </div>
      </div>

      {/* DISHES GRID */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        {dishes.map((dish, i) => (
          <div
            key={i}
            className="bg-[#FFF6DD] rounded-3xl shadow-md pb-3 relative overflow-hidden"
          >
            <img
              src={dish.img}
              alt={dish.name}
              className="w-full h-28 object-cover rounded-t-3xl"
            />

            {/* CONTENT */}
            <div className="px-3 mt-2">
              <p className="font-semibold text-[15px] leading-tight">
                {dish.name}
              </p>
              <p className="text-xs text-gray-500 -mt-1">{dish.shop}</p>

              {/* RATINGS */}
              <div className="text-yellow-500 text-sm mt-1">
                {"★".repeat(dish.rating)}{" "}
                <span className="text-gray-300">
                  {"★".repeat(5 - dish.rating)}
                </span>
              </div>

              {/* PRICE + HEART */}
              <div className="flex items-center justify-between mt-1">
                <p className="font-semibold text-[14px]">{dish.price}</p>
                <Heart size={18} className="text-red-500 fill-red-500" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* BOTTOM NAV */}
      <div className="fixed bottom-0 left-0 w-full bg-white py-3 shadow-xl flex justify-around">
        <Home className="text-black" size={26} />
        <MapPin className="text-black" size={26} />
        <Heart className="text-black" size={26} />
        <CircleUserRound className="text-black" size={26} />
      </div>
    </div>
  );
}
