import { House, MapPin, Heart, CircleUserRound } from "lucide-react";

export default function DetailsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white relative overflow-hidden">

      {/* YELLOW HEADER WITH CONTENT INSIDE */}
      <div className="bg-[#FFC533] w-3/6 mx-auto mt-20 rounded-t-[70px] shadow-md relative px-6 pt-10 pb-16 flex flex-col items-center">

        {/* FOOD IMAGE */}
        <img
          src="../Recommend Food/Kinilaw na Tuna.png"
          alt="Kinilaw na Tuna"
          className="w-52 h-56 object-contain mt-[-140px]"
        />

        {/* TEXT CONTENT */}
        <div className="w-full max-w-[360px] text-left">

          {/* FOOD NAME */}
          <p className="text-[34px] font-semibold style-neuton text-black leading-tight">
            Kinilaw na Tuna
          </p>

          {/* RESTAURANT NAME */}
          <p className="text-[18px] text-gray-700 style-poppins -mt-2 ml-10">
            - Tuna Express Restaurant
          </p>

          {/* PRICE + STAR RATING */}
          <div className="flex items-start justify-between mt-3 pr-10">
            <p className="text-[28px] font-bold text-gray-900 mt-10">₱180</p>
            <p className="text-yellow-600 text-xl font-semibold mb-1">⭐⭐⭐⭐☆</p>
          </div>
        </div>
      </div>

      {/* Key Ingredients Section */}
      <div className="mt-6 px-6">
        <h2 className="font-semibold text-gray-800 mb-3">Key Ingredients</h2>
        <div className="flex gap-3 bg-[#FFF9E8] p-3 rounded-xl overflow-x-auto shadow-md">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="flex-shrink-0 w-10 h-10 bg-white rounded-lg shadow-md"
            ></div>
          ))}
        </div>
      </div>

      {/* Our Product Section */}
      <div className="mt-6 px-6 flex flex-col">
        <h2 className="font-semibold text-gray-800 mb-3">Our Product</h2>
        <div className="grid grid-cols-2 gap-4 pb-24">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div key={item} className="bg-gray-200 h-28 rounded-xl shadow-md"></div>
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
