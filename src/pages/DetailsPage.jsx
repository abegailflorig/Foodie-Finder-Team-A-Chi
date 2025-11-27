// Cleaned and improved DetailsPage component
import { ArrowLeft, House, MapPin, Heart, CircleUserRound } from "lucide-react";

export default function DetailsPage() {
  const header = [
    { name: "Kinilaw na Tuna", file: "Kinilaw na Tuna", restaurant: "Avodah Kitchen", price: "289", discount: "20.00" },
  ];

  const ingredients = [
    { name: "Fish", file: "fish" },
    { name: "Cucumber", file: "cucumber" },
    { name: "Pepper", file: "pepper" },
    { name: "Chili", file: "chili" },
    { name: "Onion", file: "onion" },
  ];

  const similar = [
    { name: "Kinilaw na Isda", file: "Kinilaw na Isda", restaurant: "Fish Head", price: "265", discount: null },
    { name: "Kinilaw na Tuna", file: "Kinilaw na Tuna", restaurant: "Villa Tuna", price: "250", discount: "10.00" },
    { name: "Kinilaw na Isda", file: "48", restaurant: "Ah Mei's Kitchen", price: "310", discount: null },
    { name: "Kinilaw na Isda", file: "89", restaurant: "Fev's Diner", price: "345", discount: null },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white relative overflow-hidden">
      {/* Back Button */}
      <button className="mb-3 ml-3 sm:ml-6">
        <ArrowLeft size={28} className="text-black" />
      </button>

      {/* Header Card */}
      {header.map((item, index) => (
        <div
          key={index}
          className="bg-[#FFC533] w-[350px] md:w-[700px] rounded-t-[70px] shadow-md relative flex flex-col items-center mx-auto mt-20 p-6 pt-40"
        >
          {/* Food Image */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2">
            <img
              src={`/Recommend Food/${item.file}.png`}
              alt={item.name}
              className="w-40 h-44 sm:w-52 sm:h-56 object-contain"
            />
          </div>

          {/* Text Content */}
          <div className="w-full text-left">
            <p className="text-[30px] sm:text-[34px] font-semibold style-neuton text-black leading-tight">
              {item.name}
            </p>
            <p className="text-[18px] sm:text-[20px] text-gray-800 style-poppins -mt-2 ml-6 sm:ml-10">
              – {item.restaurant}
            </p>

            <div className="flex items-start justify-between mt-3 pr-6 sm:pr-10 relative style-neuton">
              <p className="text-[32px] sm:text-[38px] font-bold text-gray-900">₱{item.price}</p>
              <p className="text-yellow-600 text-lg sm:text-xl font-semibold mb-1">⭐⭐⭐⭐☆</p>

              {item.discount && (
                <span className="absolute top-16 right-2 sm:right-6 text-[14px] sm:text-[18px] bg-[#CFB53C] text-black px-2 py-[1px] rounded-full">
                  ₱{item.discount} off
                </span>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* KEY INGREDIENTS */}
      <div className="mt-6 px-4 sm:px-6">
        <h2 className="text-black style-neuton text-[26px] sm:text-[30px] mb-3">Key Ingredients</h2>

        <div className="flex gap-3 bg-[#FFFAE2] p-3 rounded-xl overflow-x-auto shadow-md">
          {ingredients.map((item) => (
            <div
              key={item.file}
              className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-white border border-white shadow-[0_20px_20px_-2px_rgba(207,181,60,0.6)] rounded-xl flex items-center justify-center"
            >
              <img
                src={`/ingredients/${item.file}.png`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `/ingredients/${item.file}.jpg`;
                }}
                alt={item.name}
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      {/* SIMILAR DISHES */}
      <div className="mt-6 px-4 sm:px-6 flex flex-col">
        <h2 className="style-neuton text-black mb-3 text-[26px] sm:text-[30px]">Similar Dish</h2>

        <div className="grid grid-cols-2 gap-6 sm:gap-10 pb-24">
          {similar.map((item) => (
            <div
              key={item.file}
              className="relative bg-white rounded-2xl border border-b-[4px] border-[#CFB53C] pt-16 pb-4 px-3 sm:px-4 flex flex-col items-center shadow-[0_25px_20px_-2px_rgba(207,181,60,0.6)]"
            >
              <div
  className={`absolute left-1/2 -translate-x-1/2 ${
    item.file === "48" ? "-top-11" : "-top-20"
  }`}
>
              <img
  src={`/similar/${item.file}.png`}
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = `/similar/${item.file}.jpg`;
  }}
  alt={item.file}
  className={`object-contain ${
    item.file === "48"
      ? "w-26 h-30"  // Smaller for Ah Mei's Kitchen
      : "w-28 h-32 sm:w-40 sm:h-44"  // Normal for all other dishes
  }`}
/>

              </div>

              <div className="flex flex-col mt-5 text-left w-full">
                <h3 className="font-semibold text-gray-900 text-[20px] sm:text-[25px] style-neuton leading-tight">
                  {item.name}
                </h3>
                <p className="text-gray-600 text-[14px] sm:text-[18px] style-poppins -mt-1">– {item.restaurant}</p>
                <p className="text-yellow-500 text-[12px] sm:text-[14px] font-semibold mt-1 leading-tight">⭐⭐⭐⭐☆</p>

                <div className="flex items-center gap-6 sm:gap-12 mt-3 style-neuton">
                  <p className="text-black font-semibold text-[20px] sm:text-[25px]">₱ {item.price}.00</p>

                  {item.discount && (
                    <span className="absolute top-36 sm:top-40 left-[81px] text-[12px] sm:text-[15px] bg-[#CFB53C] text-black px-2 py-[2px] rounded-full">
                      ₱{item.discount} off
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM NAV */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-yellow-300 rounded-t-3xl shadow-md flex justify-around items-center py-2">
        <button className="text-[#FFC533]"><House size={22} /></button>
        <button className="text-black hover:text-[#FFC533] transition"><MapPin size={22} /></button>
        <button className="text-black hover:text-[#FFC533] transition"><Heart size={22} /></button>
        <button className="text-black hover:text-[#FFC533] transition"><CircleUserRound size={22} /></button>
      </div>
    </div>
  );
}
