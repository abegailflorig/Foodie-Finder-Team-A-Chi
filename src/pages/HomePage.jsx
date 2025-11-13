import { House, MapPin, Heart, CircleUserRound} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
    {/* Header Section */}
    <div className="bg-[#FFC533] h-80 rounded-b-3xl flex flex-col items-center justify-center p-4">
    <div className="relative w-10/12 h-62 rounded-2xl shadow-md overflow-hidden">
        <img
        src="/images/banner.jpg"
        alt="Foodie Finder Banner"
        className="w-full h-full object-cover"
        />
    </div>
    </div>

    {/* Search Bar */}
    <div className="relative -mt-5 flex justify-center">
        <input
        type="text"
        placeholder="Search Bar"
        className="w-11/12 bg-white border border-yellow-300 rounded-full px-5 py-4 shadow-md focus:outline-none"
        />
    </div>

    {/* Categories Section */}
    <div className="mt-10 flex flex-col ">
    <h2 className="font-semibold text-gray-800 mb-4 px-6 ">
        Categories
    </h2>

    <div className="flex justify-center gap-6 overflow-x-auto px-6 w-full max-w-4xl pb-2">
        {["Breakfast", "Lunch", "Dinner"].map((category) => (
        <div
            key={category}
            className="relative flex-shrink-0 bg-white border border-yellow-200 rounded-full shadow-md transition-transform hover:scale-105"
        >
            <img
            src={`/images/${category.toLowerCase()}.jpg`}
            alt={category}
            className="w-65 h-20 object-cover rounded-full opacity-90"
            />
            <span
            className="absolute inset-0 flex items-center justify-center font-bold text-base text-black [text-shadow:_-1px_-1px_0_white,_1px_-1px_0_white,_-1px_1px_0_white,_1px_1px_0_white]">
            {category}
            </span>
        </div>
        ))}
    </div>
    </div>
      {/* Recommended Section */}
      <div className="mt-4 px-6 flex flex-col">
        <h2 className="font-semibold text-gray-800 mb-2">Recommended for You</h2>

        <div className="grid grid-cols-2 gap-3 overflow-y-auto pb-20">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="bg-[#FFF9E8] h-20 rounded-xl shadow-md"
            ></div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-yellow-300 rounded-t-3xl shadow-md flex justify-around items-center py-2">
        <button className="text-yellow-500">
          <House size={22} />
        </button>
        <button className="text-gray-500 hover:text-yellow-500 transition">
          <MapPin size={22} />
        </button>
        <button className="text-gray-500 hover:text-yellow-500 transition">
          <Heart size={22} />
        </button>
        <button className="text-gray-500 hover:text-yellow-500 transition">
          <CircleUserRound size={22} />
        </button>
      </div>
    </div>
  );
}
