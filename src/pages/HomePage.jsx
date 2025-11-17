import { House, MapPin, Heart, CircleUserRound} from "lucide-react";

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
  {
    file: "Kinilaw na Tuna",
    name: "Kinilaw na Tuna",
    restaurant: "Avodah Kitchen",
    rating: 5,
    price: "289",
    discount: "20",
  },
  {
    file: "Beef Noodles Soup",
    name: "Beef Noodles Soup",
    restaurant: "Ah Mei's Kitchen",
    rating: 4,
    price: "335",
    discount: null,
  },
  {
    file: "Sinugbang Panga ng Tuna",
    name: "Sinugbang Panga ng Tuna",
    restaurant: "Villa Tuna",
    rating: 5,
    price: "240",
    discount: null,
  },
  {
    file: "Sweet and Sour Pork",
    name: "Sweet and Sour Pork",
    restaurant: "Ah Mei's Kitchen",
    rating: 4.6,
    price: "160",
    discount: "20",
  },
  {
    file: "Adobong Manok",
    name: "Adobong Manok",
    restaurant: "La Fang Homegrown Gourmet",
    rating: 4,
    price: "295",
    discount: null,
  },
  {
    file: "Pinirito Isda",
    name: "Piniritong Isda",
    restaurant: "Villa Tuna",
    rating: 3,
    price: "188",
    discount: null,
  },
  {
    file: "Tinolang Tuna",
    name: "Tinolang Tuna",
    restaurant: "Villa Tuna",
    rating: 4,
    price: "295",
    discount: "30",
  },
  {
    file: "Chicken Fillet",
    name: "Chicken Fillet",
    restaurant: "The Pantry Iligan",
    rating: 4,
    price: "200",
    discount: null,
  },
];

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
        className=" w-11/12 bg-white border border-t-[#FCE8D8] border-[#FFC533] rounded-full px-5 py-4 shadow-xl focus:outline-none"
      />
    </div>

    <div className="mt-6 px-6 flex gap-6 overflow-x-auto w-full">
      {categories.map(({ file, category }) => (
        <div
          key={file}
          className="flex flex-col items-center"
        >
          <img
            src={`/browse/${file}.jpg`}
            alt={category}
            className="w-25 h-20 object-cover rounded-[10PX] opacity-90 border-b-4 border-b-[#FFC533] border-[#FCE8D8] shadow-[0_10px_14px_-4px_rgba(207,181,60,0.5)]"
          />
        </div>
      ))}
    </div>


    {/* Recommended Section */}
    <div className="mt-4 px-6 flex flex-col">
      <h2 className="text-3xl font-semibold text-black-500 mb-2 style-neuton">
        Recommended for You
      </h2>

      <div className="grid grid-cols-2 gap-4 pb-24">
        {recommendedItems.map((item) => (
          <div
            key={item.file}
            className="bg-[#FFFAE2] border border-[#FCE8D8] w-full rounded-4xl shadow-[0_4px_6px_-1px_rgba(207,181,60,0.5)] flex items-center p-1 gap-2 h-30 mt-10"
          >
            {/* LEFT: IMAGE */}
            <img
              src={`/Recommend Food/${item.file}.png`}
              alt={item.name}
              className={`w-46 h-40 object-contain mb-15
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
              <p className="text-gray-700 text-l font-regular style-poppins">
                - {item.restaurant}
              </p>

              {/* RATING */}
              <p className="text-yellow-500 text-s font-semibold mb-3">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i}>{i < item.rating ? "⭐" : "☆"}</span>
                ))}
              </p>

              {/* PRICE / DISCOUNT */}
              <div className="flex items-center gap-5 style-neuton">
                <p className="font-semibold text-black-900 text-xl">
                  ₱ {item.price}.00
                </p>

                {item.discount && (
                  <p className="text-black-600 bg-[#CFB53C] rounded-xl text-sm mb-5">
                    ₱ {item.discount}.00 off
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border border-[#CFB53C] rounded-t-[10px] shadow-md flex justify-around items-center py-2">
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
