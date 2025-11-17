import { Heart } from "lucide-react";

export default function CupsilogPage() {
  return (
    <div className="min-h-screen bg-white pb-10">

      {/* COVER IMAGE */}
      <img
        src="/cupsilog-cover.png"
        className="w-full h-48 object-cover rounded-b-3xl"
      />

      <div className="px-5 mt-4">

        {/* TITLE + ADDRESS */}
        <h2 className="font-semibold text-xl">Mui’s Cupsilog</h2>

        <p className="text-sm text-gray-700 leading-5">
          <span className="font-semibold">Address:</span> 6GJQ+3MC, Iligan City.
        </p>

        {/* RATING + REVIEWS */}
        <div className="flex items-center gap-3 mt-2">
          <p className="text-yellow-500 font-medium text-sm">5.0 ★★★★★</p>
          <span className="bg-yellow-300 px-3 py-1 rounded-full text-xs">
            reviews
          </span>
        </div>

        {/* MAP SECTION */}
        <div className="mt-3 w-full">
          <img
            src="/map-preview.png"
            className="w-full rounded-xl shadow-sm"
          />
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-gray-600">Get There: 19 min</p>
            <button className="text-xs bg-yellow-100 px-3 py-1 rounded-full border border-yellow-300">
              view map
            </button>
          </div>
        </div>

        {/* OUR PRODUCT TITLE */}
        <h3 className="font-semibold text-md mt-5 mb-2">Our Product</h3>

        {/* PRODUCT LIST */}
        <div className="space-y-4">

          {/* PRODUCT 1 */}
          <div className="bg-[#FFF9E8] rounded-2xl p-2 shadow-sm border border-yellow-100 flex items-center gap-3">
            <img
              src="/lumsilog.png"
              className="w-20 h-20 object-cover rounded-xl"
            />

            <div className="flex-1">
              <h4 className="font-semibold text-md">Lumsilog</h4>
              <p className="text-yellow-500 text-sm">★★★★★</p>
              <p className="text-sm font-medium">₱ 45.00</p>
            </div>

            <Heart className="text-red-400" fill="red" size={22} />
          </div>

          {/* PRODUCT 2 */}
          <div className="bg-[#FFF9E8] rounded-2xl p-2 shadow-sm border border-yellow-100 flex items-center gap-3">
            <img
              src="/tapsilog.png"
              className="w-20 h-20 object-cover rounded-xl"
            />

            <div className="flex-1">
              <h4 className="font-semibold text-md">Tapsilog</h4>
              <p className="text-yellow-500 text-sm">★★★★★</p>
              <p className="text-sm font-medium">₱ 40.00</p>
            </div>

            <Heart className="text-red-400" fill="red" size={22} />
          </div>

        </div>
      </div>
    </div>
  );
}
