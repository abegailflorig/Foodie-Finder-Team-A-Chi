import { House, MapPin, Heart, CircleUserRound} from "lucide-react";

export default function DetailsPage() {
  return (
    <div className="flex flex-col h-screen bg-white relative overflow-hidden">
      {/* Yellow Header Shape */}
      <div className="bg-[#FFC533] h-50 w-5/14 mx-auto mt-6 rounded-t-3xl rounded-b-none shadow-md"></div>

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

        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="bg-gray-200 h-28 rounded-xl shadow-md"
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
