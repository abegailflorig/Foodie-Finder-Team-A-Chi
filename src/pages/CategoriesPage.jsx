import { Home, MapPin, Heart, CircleUserRound } from "lucide-react";

export default function CategoriesPage() {
  const dishes = [
    { name: "Lumpia Shanghai", restaurant: "Ah Mei's Kitchen", price: "295", file: "lumpia", rating: 5 },
    { name: "Lumsilog", restaurant: "Mui’s Cupsilog", price: "45", file: "lumsilog", rating: 5 },
    { name: "Kangkong with Pork", restaurant: "The Pantry Iligan", price: "95", file: "kangkong", rating: 3 },
    { name: "Tortang Talong", restaurant: "La Fang Homegrown Gourmet", price: "35", file: "torta", rating: 5 },
    { name: "Bibimbap", restaurant: "Ah Mei’s Kitchen", price: "185", file: "bibimbap", rating: 4 },
    { name: "Ampalaya with Egg", restaurant: "SUOK Bistro", price: "79", file: "ampalaya", rating: 3 },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white px-6 pt-4 pb-24">
      <p className="text-[32px] font-regular style-neuton -mt-1">Find your Favorites Food</p>

      {/* SEARCH BAR */}
      <div className="mt-3">
        <input
          placeholder="Search Bar"
          className="text-[20px] style-neuton w-full bg-white border-[2px] border-t-[#FCE8D8] border-[#D7C15B] rounded-full px-4 py-2 outline-none shadow-[0_4px_6px_-1px_rgba(207,181,60,0.5)]"
        />
      </div>

      {/* Categories Section */}
      <div className="mt-10 flex flex-col">
        <h2 className="text-3xl font-regular text-black-500 mb-2 style-neuton">
          Categories
        </h2>
        <div className="style-neuton flex justify-center gap-6 overflow-x-auto px-6 w-full max-w-4xl pb-2">
          {["BREAKFAST", "LUNCH", "DINNER"].map((category) => (
            <div
              key={category}
              className="relative flex-shrink-0 bg-white border border-[#FFC533] rounded-full shadow-[0_4px_6px_-1px_rgba(207,181,60,0.5)] transition-transform hover:scale-105"
            >
              <img
                src={`/images/${category}.jpg`}
                alt={category}
                className="w-65 h-20 object-cover rounded-full opacity-90 blur-[1px]"
              />
              <span className="absolute inset-0 flex items-center justify-center font-bold text-base text-black [text-shadow:_-1px_-1px_0_white,_1px_-1px_0_white,_-1px_1px_0_white,_1px_1px_0_white]">
                {category}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* DISHES GRID */}
      <div className="grid grid-cols-2 mt-20 gap-x-6 gap-y-12 ">
        {dishes.map((dish, i) => (
          <div key={i} className="relative pb-10">
            
            {/* IMAGE (Floating on top) */}
            <img
              src={`/dishes/${dish.file}.png`}
              alt={dish.name}
              className="absolute top-1 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150px] h-[150px] object-cover rounded-full shadow-lg border-2 border-white z-10"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `/dishes/${dish.file}.jpg`; // fallback
              }}
            />

            {/* Main dish card (Yellow background) */}
            <div className="bg-[#FFFAE2] border border-x-[2px] border-b-[5px] border-[#CFB53C] shadow-[0_30px_25px_5px_rgba(207,181,60,0.35)] rounded-t-[32px]  pt-12 pb-4 px-3  flex flex-col  ">
              {/* CONTENT */}
              <div className="mt-8 text-left px-1">
                {/* Name & Shop */}
                <p className="font-bold text-black text-[22px] style-neuton leading-tight">{dish.name}</p>
                <p className="text-s style-poppins text-gray-500 -mt-1 p-2">-{dish.restaurant}</p>

                {/* RATINGS */}
                <p className="text-yellow-500 text-s font-semibold mb-3">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i}>{i < dish.rating ? "⭐" : "☆"}</span>
                  ))}
                </p>

                {/* PRICE */}
                <p className="font-extrabold text-[28px] style-neuton mb-1 text-right">₱ {dish.price}.00</p>
              </div>

              {/* BOTTOM SECTION: HEART + DISCOUNT */}
              <div className="mt-auto flex flex-col items-center gap-1">
              {/* HEART ICON floating slightly above the bottom */}
              <Heart
                size={28}
                className="text-[#FF7979] fill-[#FF7979] mb-[-32px] transition-transform hover:scale-110"
              />

              {/* DISCOUNT BADGE */}
              {dish.discount && (
                <span className="inline-block text-sm bg-[#CFB53C] text-black px-3 py-1 rounded-full">
                  ₱{dish.discount}.00 off
                </span>
              )}
            </div>
            </div>
          </div>
        ))}
      </div>

      {/* BOTTOM NAV */}
      <div className="fixed bottom-0 left-0 w-full bg-white border border-[#CFB53C] rounded-t-[10px] py-3  flex justify-around z-50">
        <Home className="text-black" size={26} />
        <MapPin className="text-black" size={26} />
        <Heart className="text-black" size={26} />
        <CircleUserRound className="text-black" size={26} />
      </div>
    </div>
  );
}
