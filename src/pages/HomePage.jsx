import { House, MapPin, Heart, CircleUserRound } from "lucide-react";

export default function HomePage() {
  const categories = [
    { file: "pizza", category: "Pizza" },
    { file: "spaghetti", category: "Spaghetti" },
    { file: "cakes", category: "Cakes" },
    { file: "pasta", category: "Pasta" },
    { file: "fried chicken", category: "Fried Chicken" },
    { file: "steak", category: "Steak" },
  ];

  const recommendedItems = [
    { file: "Kinilaw na Tuna", name: "Kinilaw na Tuna", restaurant: "Avodah Kitchen", rating: 5, price: "289", discount: "20" },
    { file: "Beef Noodles Soup", name: "Beef Noodles Soup", restaurant: "Ah Mei's Kitchen", rating: 4, price: "335", discount: null },
    { file: "Sinugbang Panga ng Tuna", name: "Sinugbang Panga ng Tuna", restaurant: "Villa Tuna", rating: 5, price: "240", discount: null },
    { file: "Sweet and Sour Pork", name: "Sweet and Sour Pork", restaurant: "Ah Mei's Kitchen", rating: 4.6, price: "160", discount: "20" },
    { file: "Adobong Manok", name: "Adobong Manok", restaurant: "La Fang Homegrown Gourmet", rating: 4, price: "295", discount: null },
    { file: "Pinirito Isda", name: "Piniritong Isda", restaurant: "Villa Tuna", rating: 3, price: "188", discount: null },
    { file: "Tinolang Tuna", name: "Tinolang Tuna", restaurant: "Villa Tuna", rating: 4, price: "295", discount: "30" },
    { file: "Chicken Fillet", name: "Chicken Fillet", restaurant: "The Pantry Iligan", rating: 4, price: "200", discount: null },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* Header Section */}
      <div className="bg-[#FFC533] h-80 rounded-b-3xl flex flex-col items-center justify-center p-4">
        <div className="relative w-full md:w-10/12 h-60 md:h-62 rounded-2xl shadow-md overflow-hidden">
          <img
            src="/images/banner.jpg"
            alt="Foodie Finder Banner"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative -mt-5 flex justify-center font-semibold text-xl text-black style-neuton px-4">
        <input
          type="text"
          placeholder="Search Bar"
          className="w-full md:w-11/12 bg-white border border-[#FFC533] rounded-full px-5 py-4 shadow-xl focus:outline-none"
        />
      </div>

      {/* Categories */}
      <div className="mt-6 px-4 md:px-6 flex gap-4 overflow-x-auto w-full">
        {categories.map(({ file, category }) => (
          <div key={file} className="flex flex-col items-center flex-shrink-0">
            <img
              src={`/browse/${file}.jpg`}
              alt={category}
              className="w-24 h-20 md:w-25 md:h-20 object-cover rounded-[10px] opacity-90 border-b-4 border-b-[#FFC533] shadow-[0_10px_14px_-4px_rgba(207,181,60,0.5)]"
            />
            <p className="text-sm md:text-base mt-1">{category}</p>
          </div>
        ))}
      </div>

      {/* Recommended Section */}
      <div className="mt-4 px-4 md:px-6 flex flex-col">
        <h2 className="text-2xl md:text-3xl font-semibold mb-2 style-neuton">
          Recommended for You
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 pb-24">
          {recommendedItems.map((item) => (
            <div
              key={item.file}
              className="bg-[#FFFAE2] border border-[#FCE8D8] w-full rounded-4xl shadow-[0_4px_6px_-1px_rgba(207,181,60,0.5)] flex items-center p-2 md:p-3 gap-2 h-auto"
            >
              {/* LEFT: IMAGE */}
              <div className="flex-shrink-0 w-36 md:w-46 h-36 md:h-40 flex items-center  top -5 justify-center ">
                <img
                  src={`/Recommend Food/${item.file}.png`}
                  alt={item.name}
                  className="w-full h-full object-contain "
                />
              </div>

              {/* RIGHT: TEXT */}
              <div className="flex-1 flex flex-col justify-center mt-1 md:mt-0">
                <p className="font-bold text-xl md:text-2xl style-neuton">{item.name}</p>
                <p className="text-gray-700 text-sm md:text-base style-poppins">- {item.restaurant}</p>
                <p className="text-yellow-500 text-sm font-semibold mt-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i}>{i < Math.round(item.rating) ? "⭐" : "☆"}</span>
                  ))}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <p className="font-semibold text-black text-lg md:text-xl">₱ {item.price}.00</p>
                  {item.discount && (
                    <span className="bg-[#CFB53C] text-xs font-bold px-2 py-1 rounded-full text-black">
                      ₱ {item.discount}.00 off
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#CFB53C] rounded-t-[10px] shadow-md flex justify-around items-center py-2">
        <button className="text-[#FFC533]">
          <House size={26} />
        </button>
        <button className="text-black hover:text-[#FFC533] transition">
          <MapPin size={26} />
        </button>
        <button className="text-black hover:text-[#FFC533] transition">
          <Heart size={26} />
        </button>
        <button className="text-black hover:text-[#FFC533] transition">
          <CircleUserRound size={26} />
        </button>
      </div>
    </div>
  );
}
