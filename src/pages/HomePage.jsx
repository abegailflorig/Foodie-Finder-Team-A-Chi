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
    <div className="relative -mt-5 flex justify-center font-semibold text-xl text-[#000000] style-neuton">
        <input
        type="text"
        placeholder="Search Bar"
        className=" w-11/12 bg-white border border-[#FCE8D8] rounded-full px-5 py-4 shadow-xl focus:outline-none"
        />
    </div>

    {/* Categories Section */}
    <div className="mt-10 flex flex-col ">
    <h2 className="text-3xl font-semibold text-black-500 mb-2 style-neuton px-6 ">
        Categories
    </h2>

    <div className="style-neuton flex justify-center gap-6 overflow-x-auto px-6 w-full max-w-4xl pb-2">
        {["BREAKFAST", "LUNCH", "DINNER"].map((category) => (
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
      <h2 className="text-3xl font-semibold text-black-500 mb-2 style-neuton">Recommended for You</h2>
      <div className="grid grid-cols-2 gap-4 pb-24">
        {[
          {
            file: "Kinilaw na Tuna",
            name: "Kinilaw na Tuna",
            restaurant: "-Avodah Kitchen",
            rating: 5,
            price: "₱289.00",
            discount: "₱20.00 off",
          },
          {
            file: "Beef Noodles Soup",
            name: "Beef Noodles Soup",
            restaurant: "-Ah Mei's Kitchen",
            rating: 4,
            price: "₱335",
            discount: null,
          },
          {
            file: "Sinugbang Panga ng Tuna",
            name: "Sinugbang Panga ng Tuna",
            restaurant: "-Villa Tuna",
            rating: 5,
            price: "₱240",
            discount: null,
          },
          {
            file: "Sweet and Sour Pork",
            name: "Sweet and Sour Pork",
            restaurant: "-Ah Mei's Kitchen",
            rating: 4.6,
            price: "₱160",
            discount: "₱20.00 off",
          },
          {
            file: "Adobong Manok",
            name: "Adobong Manok",
            restaurant: "-La Fang Homegrown Gourmet",
            rating: 4,
            price: "₱295.00",
            discount: null,
          },
          {
            file: "Pinirito Isda",
            name: "Piniritong Isda",
            restaurant: "-Villa Tuna",
            rating: 3,
            price: "₱188.00",
            discount: null,
          },
          {
            file: "Tinolang Tuna",
            name: "Tinolang Tuna",
            restaurant: "-Villa Tuna",
            rating: 4,
            price: "₱295.00",
            discount: "₱30.00 off",
          },
          {
            file: "Chicken Fillet",
            name: "Chicken Fillet",
            restaurant: "-The Pantry Iligan",
            rating: 4,
            price: "₱200.00",
            discount: null,
          },
        ].map((item) => (
          <div
            key={item.file}
            className="bg-[#FFFAE2] w-full rounded-4xl shadow-xl flex items-center p-1 gap-2 h-30 mt-10">
            {/* LEFT: IMAGE */}
            <img
              src={`/Recommend Food/${item.file}.png`}
              alt={item.name}
              className={`w-46 h-40  object-contain mb-15
                ${item.file === "Sinugbang Panga ng Tuna" ? "-rotate-22" : ""}
                ${item.file === "Pinirito Isda" ? "-rotate-20" : ""}
                ${item.file === "Tinolang Tuna" ? "-rotate-40" : ""}
              `}
            />

            {/* RIGHT: TEXT */}
            <div className="flex flex-col justify-center">
              
              {/* FOOD NAME */}
              <p className="font-bold text-2xl text-black-900 style-neuton">
                {item.name}
              </p>

              {/* RESTAURANT */}
              <p className="text-gray-700 text-l font-regular style-poppins">{item.restaurant}</p>

              {/* RATING */}
              <p className="text-yellow-500 text-s font-semibold mb-3">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i}>
                    {i < item.rating ? "⭐" : "☆"}
                  </span>
                ))}
              </p>

              {/* PRICE / DISCOUNT */}
              <div className="flex items-center gap-5 style-neuton">
                <p className="font-semibold text-black-900 text-xl">
                  {item.price}
                </p>
                {item.discount && (
                  <p className="text-black-600 bg-[#CFB53C] rounded-xl text-sm mb-5">
                    {item.discount}
                  </p>
                )}
              </div>
            </div>
          </div>
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
