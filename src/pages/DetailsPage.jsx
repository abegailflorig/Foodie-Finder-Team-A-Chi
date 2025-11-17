import { ArrowLeft, House, MapPin, Heart, CircleUserRound } from "lucide-react";

export default function DetailsPage() {
const header = [
  { name: "Kinilaw na Tuna", file: "Kinilaw na Tuna", restaurant: "Avodah Kitchen", price:"289", discount: "20.00" },
];

const ingredients = [
  { name: "Fish", file: "fish"},
  { name: "Cucumber", file: "cucumber" },
  { name: "Pepper", file: "pepper" },
  { name: "Chili", file: "chili" },
  { name: "Onion", file: "onion" },
];

const similar = [
  { name: "Kinilaw na Isda", file: "Kinilaw na Isda", restaurant: "Fish Head", price:"265", discount: null },
  { name: "Kinilaw na Tuna", file: "Kinilaw na Tuna", restaurant: "Villa Tuna", price: "250", discount:"10.00" },
  { name: "Kinilaw na Isda", file: "48", restaurant: "Ah Mei's Kitchen", price: "310", discount: null },
  { name: "Kinilaw na Isda", file: "89", restaurant: "Fev's Diner", price: "345", discount: null },
];

  return (
    <div className="flex flex-col min-h-screen bg-white relative overflow-hidden">
      {/* Back Arrow + Search Bar */}
      <button className="mb-3">
        <ArrowLeft size={28} className="text-black" />
      </button>
      {header.map((item, index) => (
        <div
          key={index}
          className="bg-[#FFC533] w-3/6 rounded-t-[70px] shadow-md relative flex flex-col items-center mx-auto mt-20 p-6 pt-40"
        >
          {/* FOOD IMAGE */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2">
            <img
              src={`../Recommend Food/${item.file}.png`}
              alt={item.name}
              className="w-52 h-56 object-contain"
            />
          </div>

          {/* TEXT CONTENT */}
          <div className="w-full text-left">
            {/* FOOD NAME */}
            <p className="text-[34px] font-semibold style-neuton text-black leading-tight">
              {item.name}
            </p>

            {/* RESTAURANT NAME */}
            <p className="text-[20px] font-regular text-gray-800 style-poppins -mt-2 ml-10">
              – {item.restaurant}
            </p>

            {/* PRICE + STAR RATING */}
            <div className="flex items-start justify-between mt-3 pr-10 relative style-neuton">
              {/* Price */}
              <p className="text-[38px] font-bold text-gray-900">
                ₱{item.price}
              </p>

              {/* Star Rating */}
              <p className="text-yellow-600 text-xl font-semibold mb-1">
                ⭐⭐⭐⭐☆
              </p>

              {/* Discount - Positioned at the edge */}
              {item.discount && (
                <span className="absolute top-17 -right-6 text-[18px] bg-[#CFB53C] text-black px-2 py-[1px] rounded-full font-regular">
                  ₱{item.discount} off
                </span>
              )}
            </div>
          </div>
        </div>
      ))}



      {/* Key Ingredients Section */}
      <div className="mt-6 px-6">
        <h2 className="font-regular text-black style-neuton text-[30px] mb-3">Key Ingredients</h2>

        <div className="flex gap-3 bg-[#FFFAE2] p-3 rounded-xl overflow-x-auto shadow-md">
          {ingredients.map((item) => (
            <div
              key={item.file}
              className="flex-shrink-0 w-14 h-14 bg-white border border-white shadow-[0_20px_20px_-2px_rgba(207,181,60,0.6)] rounded-xl flex items-center justify-center"
            >
              <img
                src={`/ingredients/${item.file}.png`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `/ingredients/${item.file}.jpg`;
                }}
                alt={item.name}
                className="w-10 h-10 object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Similar Dish Section */}
      <div className="mt-6 px-6 flex flex-col">
        <h2 className="font-regular style-neuton text-black mb-3 text-[30px]">Similar Dish</h2>
        <div className="grid grid-cols-2 gap-10 pb-24">
          {similar.map((item) => (
            <div
            key={item.file}
            className="relative bg-white rounded-2xl border border-b-[4px]  border-[#CFB53C] pt-16 pb-4 px-4 flex flex-col items-center shadow-[0_25px_20px_-2px_rgba(207,181,60,0.6)]">
            {/* FLOATING IMAGE */}
            <div className={
                  item.file === "Kinilaw na Isda"
                    ? "absolute -top-22 left-1/2 -translate-x-1/2"
                    : "absolute -top-18 left-1/2 -translate-x-1/2"
                }
              >
              <img
                src={`/similar/${item.file}.png`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `/similar/${item.file}.jpg`;
                }}
                alt={item.file}
                className={
                  item.file === "48"
                    ? "w-34 h-50 object-contain" 
                    : "w-48 h-45 object-contain"
                }
              />
            </div>
            <div className="flex flex-col mt-5">
              {/* Dish Name */}
              <h3 className="font-semibold text-gray-900 text-[25px] style-neuton leading-tight text-left">
                {item.name}
              </h3>

              {/* Restaurant */}
              <p className="text-gray-600 text-[18px] style-poppins -mt-1 text-center">
                – {item.restaurant}
              </p>

              {/* Rating */}
              <p className="text-yellow-500 text-[14px] font-semibold mt-1 leading-tight text-left">
                ⭐⭐⭐⭐☆
              </p>

              {/* Price + Discount */}
              <div className="flex items-center gap-12 mt-3 style-neuton">
                <p className="text-black font-semibold text-[25px]">₱ {item.price}.00</p>

                {item.discount && (
                  <span className="absolute top-40 left-81 text-[15px] bg-[#CFB53C] text-black px-2 py-[2px] rounded-full font-regular">
                    ₱{item.discount} off
                  </span>
                )}
              </div>
            </div>
          </div>
          ))}
        </div>
      </div>
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-yellow-300 rounded-t-3xl shadow-md flex justify-around items-center py-2">
        <button className="text-[#FFC533]">
          <House size={22} />
        </button>
        <button className="text-black hover:text-[#FFC533] transition">
          <MapPin size={22} />
        </button>
        <button className="text-black hover:text-[#FFC533] transition">
          <Heart size={22} />
        </button>
        <button className="text-black hover:text-[#FFC533] transition">
          <CircleUserRound size={22} />
        </button>
      </div>
    </div>
  );
}
