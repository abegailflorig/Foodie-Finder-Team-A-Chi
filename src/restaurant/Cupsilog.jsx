import { Heart } from "lucide-react";

export default function CupsilogPage() {
  return (
    <div className="min-h-screen bg-white pb-10">

      {/* BANNER */}
      <img
        src="/places/cupsilog-cover.png"
        className="w-full h-48 sm:h-56 object-cover shadow-md"
        style={{ borderTopLeftRadius: "35px", borderTopRightRadius: "35px", marginTop: "20px" }}
      />

      <div className="px-5 mt-2">

        {/* TITLE + ADDRESS */}
        <h2 className="font-semibold text-lg sm:text-xl mt-1">Mui’s Cupsilog</h2>

        <p className="text-[13px] sm:text-sm text-gray-700 leading-5 mt-1">
          <span className="font-semibold">Address:</span> 6GJQ+3MC, Iligan City.
        </p>

        {/* RATING */}
        <div className="flex items-center gap-3 mt-2">
          <p className="text-yellow-500 font-medium text-[13px] sm:text-sm">5.0 ★★★★★</p>
          <span className="bg-yellow-300 px-3 py-1 rounded-full text-[11px] sm:text-xs">
            reviews
          </span>
        </div>

        {/* MAP CARD - FULL RESPONSIVE */}
        <div className="mt-2 w-full">
          <div className="
            flex
            bg-white 
            rounded-2xl 
            shadow-md 
            overflow-hidden 
            border border-yellow-200
            w-full
          ">
            {/* MAP IMAGE - auto scales */}
            <img
              src="/places/map-preview.jpg"
              className="
                w-50 h-12
                sm:w-50 sm:h-15 
                object-cover
              "
            />

            {/* TEXT + BUTTON */}
            <div className="
              flex-1 
              flex flex-col 
              justify-center 
              px-3
            ">
              <p className="text-[14px] sm:text-lg text-gray-700 font-medium">
                Get There: 19 min
              </p>

              <button
                className="
                  text-[10px] sm:text-xs 
                  font-medium 
                  text-black 
                  bg-yellow-100 
                  px-3 py-[4px] 
                  rounded-full 
                  border border-yellow-300 
                  mt-1 w-max
                "
              >
                view map
              </button>
            </div>
          </div>
        </div>

        {/* OUR PRODUCT */}
        <h3 className="font-semibold text-md mt-5 mb-2">Our Product</h3>

        {/* PRODUCT LIST */}
        <div className="space-y-4">

          {/* PRODUCT CARD */}
          {[
            { name: "Lumsilog", price: "45.00", file: "lumsilog" },
            { name: "Tapsilog", price: "40.00", file: "tapsilog" },
          ].map((p, i) => (
            <div
              key={i}
              className="
                bg-[#FFF9E8] 
                rounded-2xl 
                p-2 
                shadow-sm 
                border border-yellow-100 
                flex items-center gap-3
              "
            >
              <img
                src={`/dishes/${p.file}.png`}
                className="w-20 h-20 object-cover rounded-xl"
              />

              <div className="flex-1">
                <h4 className="font-semibold text-sm sm:text-md">{p.name}</h4>
                <p className="text-yellow-500 text-[12px] sm:text-sm">★★★★★</p>
                <p className="text-[13px] sm:text-sm font-medium">₱ {p.price}</p>
              </div>

              <Heart className="text-red-400" fill="red" size={22} />
            </div>
          ))}

        </div>

      </div>
    </div>
  );
}
