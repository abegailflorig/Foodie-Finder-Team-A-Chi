import { ArrowLeft, House, MapPin, Heart, CircleUserRound, Trash2 } from "lucide-react";

const items = [
  {
    file: "ampalaya",
    name: "Ampalaya with egg",
    restaurant: "SUOK Bistro",
    rating: 4,
    price: "79",
    discount: null,
  },
  {
    file: "bibimbap",
    name: "Bibimbap",
    restaurant: "Ah Mei's Kitchen",
    rating: 4,
    price: "185",
    discount: null,
  },
  {
    file: "kinilaw",
    name: "Kinilaw na Tuna",
    restaurant: "Avodah Kitchen",
    rating: 5,
    price: "289",
    discount: "20.00",
  },
  {
    file: "Sweet and Sour Pork", // Corrected file name assumption
    name: "Sweet and Sour Pork",
    restaurant: "Ah Mei's Kitchen",
    rating: 4,
    price: "265",
    discount: "20.00",
  },
];

export default function FavoritePage() {
  return (
    // Set overflow-y-auto on the whole page wrapper
    <div className="w-full min-h-screen bg-[#FFF9E8] pb-24">
      {/* HEADER */}
      <div className="bg-[#FFC533] h-48 rounded-b-3xl p-5 relative flex flex-col justify-between">
        <div className="flex justify-between items-start pt-2">
           <button className="p-2 -ml-2">
             <ArrowLeft size={28} className="text-black" />
           </button>
           <div className="w-28 h-28 rounded-full overflow-hidden bg-white flex items-center justify-center shadow-md">
             <img
               src="secondary-logo.png"
               alt="Foodie Finder"
               className="w-full h-full object-contain"
             />
           </div>
        </div>
        {/* TITLE */}
        <h1 className="text-[54px] font-regular font-['Neuton',sans-serif] -mt-6">Favorites</h1>
      </div>

      {/* FAVORITE ITEMS LIST */}
      <div className="mt-6 space-y-5 ml-60 pb-20">
        {items.map((item, i) => (
          <div
            key={i}
            className="relative bg-white rounded-l-[20px] p-3 pl-28 flex items-stretch shadow border-b-4 border-white border-b-[#CFB53C]  shadow-[0_10px_10px_-2px_rgba(207,181,60,0.6)]" 
          >
            {/* FLOATING IMAGE (Positioned on the left side) */}
            <img
              src={`/dishes/${item.file}.png`}
              alt={item.name}
              // Absolute positioning to the left edge, halfway up/down the card
              className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2 w-38 h-38 object-cover rounded-full shadow-xl  z-10"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `/dishes/${dish.file}.jpg`; // Fallback
              }}
            />

            {/* CARD CONTENT */}
            <div className="flex-1 pr-14 flex flex-col justify-center">
              {/* Name & Restaurant */}
              <p className="font-semibold font-['Neuton',sans-serif] text-[30px] text-black leading-tight">
                {item.name}
              </p>
              <p className="text-gray-700 style-poppins text-[20px] font-regular -mt-1 m-5">
                - {item.restaurant}
              </p>
              
              <p className="text-yellow-500 text-sm font-semibold mb-3">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i}>{i < item.rating ? "⭐" : "☆"}</span>
                ))}
              </p>
            {/* PRICE & DISCOUNT ROW */}
                      <div className="style-neuton text-[20px] flex items-center justify-start mt-2 space-x-2">
                        <p className="font-bold text-xl text-black">
                          ₱ {item.price}.00
                        </p>

                        {item.discount && (
                          <span className="bg-[#CFB53C] text-xs font-bold px-2 py-1 rounded-full text-black">
                            ₱ {item.discount} off
                          </span>
                        )}
                      </div>
                    </div>

                    {/* TRASH ICON BUTTON (Yellow square on the far right) */}
                    <button className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-[#CFB53C] w-10 h-10 rounded-lg flex items-center justify-center shadow-md hover:bg-yellow-600 transition">
                      <Trash2 size={20} className="text-black" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Bottom Navigation */}
              <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-yellow-300 shadow-2xl rounded-t-3xl flex justify-around items-center py-4 z-50">
                <button className="text-black hover:text-yellow-500 transition">
                  <House size={22} />
                </button>
                <button className="text-black hover:text-yellow-500 transition">
                  <MapPin size={22} />
                </button>
                <button className="text-yellow-500 transition">
                  <Heart size={22} fill="currentColor" />
                </button>
                <button className="text-black hover:text-yellow-500 transition">
                  <CircleUserRound size={22} />
                </button>
              </div>
            </div>
          );
        }