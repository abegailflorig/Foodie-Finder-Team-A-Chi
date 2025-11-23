import { ArrowLeft } from "lucide-react";

export default function DetailsPage() {
  const header = [
    {
      name: "Kinilaw na Tuna",
      file: "Kinilaw na Tuna",
      restaurant: "Avodah Kitchen",
      price: "289",
      discount: "20.00",
    },
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
    <div className="flex flex-col min-h-screen bg-white relative overflow-hidden px-4 sm:px-6">

      {/* Back Arrow */}
      <button className="mb-3 mt-2">
        <ArrowLeft size={28} className="text-black" />
      </button>

      {/* HEADER CARD */}
      {header.map((item) => (
        <div
          key={item.file}
          className="
            bg-[#FFC533]
            w-full sm:w-4/6 lg:w-3/6
            rounded-t-[70px]
            shadow-md relative
            flex flex-col items-center
            mx-auto mt-20 p-6 pt-40
          "
        >
          {/* FLOATING IMAGE */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2">
            <img
              src={`../Recommend Food/${item.file}.png`}
              alt={item.name}
              className="
                w-44 h-48
                sm:w-52 sm:h-56
                object-contain
              "
            />
          </div>

          {/* TEXT CONTENT */}
          <div className="w-full text-left">
            <p className="text-[30px] sm:text-[34px] font-semibold style-neuton text-black leading-tight">
              {item.name}
            </p>

            <p className="text-[18px] sm:text-[20px] font-regular text-gray-800 style-poppins -mt-1 ml-8 sm:ml-10">
              – {item.restaurant}
            </p>

            {/* PRICE + DISCOUNT INLINE */}
            <div className="flex items-center justify-between mt-4 pr-4 style-neuton">
              <div className="flex items-center gap-3">
                <p className="text-[32px] sm:text-[38px] font-bold text-gray-900">
                  ₱{item.price}
                </p>

                {item.discount && (
                  <span className="text-[15px] sm:text-[17px] bg-[#CFB53C] text-black px-3 py-[2px] rounded-full font-regular">
                    ₱{item.discount} off
                  </span>
                )}
              </div>

              <p className="text-black-400 text-2xl sm:text-xl font-semibold">
              ☆ ☆ ☆ ☆ ☆
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* INGREDIENTS */}
      <div className="mt-6">
        <h2 className="font-regular text-black style-neuton text-[26px] sm:text-[30px] mb-3">
          Key Ingredients
        </h2>

        <div className="flex gap-3 bg-[#FFFAE2] p-3 rounded-xl overflow-x-auto shadow-md">
          {ingredients.map((item) => (
            <div
              key={item.file}
              className="flex-shrink-0 w-14 h-14 bg-white border border-white shadow-[0_20px_20px_-2px_rgba(207,181,60,0.6)] rounded-xl flex items-center justify-center"
            >
              <img
                src={`/ingredients/${item.file}.png`}
                alt={item.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `/ingredients/${item.file}.jpg`;
                }}
                className="w-10 h-10 object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      {/* SIMILAR DISH SECTION */}
      <div className="mt-8 flex flex-col">
        <h2 className="font-regular style-neuton text-black mb-3 text-[26px] sm:text-[30px]">
          Similar Dish
        </h2>

        {/* FORCE 2 PER ROW ON MOBILE */}
        <div className="grid grid-cols-2 gap-6 sm:gap-10 pb-24">

          {similar.map((item) => (
            <div
              key={item.file}
              className="
                relative bg-white rounded-2xl border 
                border-b-[4px] border-[#CFB53C] 
                pt-16 pb-4 px-4 flex flex-col items-center
                shadow-[0_25px_20px_-2px_rgba(207,181,60,0.6)]
              "
            >
              {/* FLOATING IMAGE */}
              <div className="absolute -top-16 left-1/2 -translate-x-1/2">
                <img
                  src={`/similar/${item.file}.png`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `/similar/${item.file}.jpg`;
                  }}
                  className="
                    w-28 h-32
                    sm:w-36 sm:h-40
                    lg:w-44 lg:h-48
                    object-contain
                  "
                  alt={item.name}
                />
              </div>

              {/* CARD CONTENT */}
              <div className="flex flex-col mt-6 text-center">
                <h3 className="font-semibold text-gray-900 text-[18px] sm:text-[22px] style-neuton">
                  {item.name}
                </h3>

                <p className="text-gray-600 text-[13px] sm:text-[15px] style-poppins -mt-1">
                  – {item.restaurant}
                </p>

                <p className="text-yellow-500 text-[14px] font-semibold mt-1">
                  ⭐⭐⭐⭐⭐
                </p>

                {/* PRICE + DISCOUNT INLINE */}
                <div className="flex items-center justify-center gap-2 mt-2 style-neuton">
                  <p className="text-black font-semibold text-[18px] sm:text-[20px]">
                    ₱ {item.price}
                  </p>

                  {item.discount && (
                    <span className="text-[11px] sm:text-[13px] bg-[#CFB53C] text-black px-2 py-[1px] rounded-full">
                      ₱{item.discount} off
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
