import { ArrowLeft, House, MapPin, Heart, CircleUserRound } from "lucide-react";

export default function LocationPage() {
  const items = [
    {
      file: "Mui's",
      name: "Mui’s Cupsilog",
      address: "6LQJ+3MC, Iligan City.",
      time: "19 min",
      rating: "5.0 ★★★★★",
    },
    {
      file: "avodah",
      name: "Avodah Kitchen",
      address: "Badelles Hills, C3, Iligan City.",
      time: "12 min",
      rating: "4.5 ★★★★★",
    },
    {
      file: "villa-tuna",
      name: "Villa Tuna",
      address: "59 Ubaldo Laya Ave, Iligan City",
      time: "22 min",
      rating: "4.0 ★★★★☆",
    },
    {
      file: "mei's",
      name: "Ah Mei’s Kitchen",
      address: "Iligan City.",
      time: "24 min",
      rating: "4.5 ★★★★★",
    },
    {
      file: "fish-head",
      name: "Fish Head",
      address: "66PW+QCJ, Pedro Permites Rd, Iligan City",
      time: "26 min",
      rating: "3.0 ★★★☆☆",
    }
  ];

  return (
    <div className="min-h-screen bg-[#FFFAE2] flex flex-col">

      {/* Back Arrow + Search Bar */}
      <div className="px-5 pt-4">
        <button className="mb-3">
          <ArrowLeft size={28} className="text-black" />
        </button>

        <input
          type="text"
          placeholder="Search Restaurant"
          className="w-full style-neuton text-[22px] sm:text-[24px] px-5 py-3 border border-t-[#FCE8D8] border-[#FFC533] rounded-full bg-white shadow-xl outline-none"
        />
      </div>

      {/* Content */}
      <div className="px-5 mt-6">
        <h2 className="font-regular text-[22px] sm:text-[24px] style-neuton mb-3">
          Nearby Restaurant
        </h2>

        {/* Restaurant Cards */}
        <div className="space-y-5 pb-24">

          {items.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-[25px] border border-t-[#FCE8D8] border-[#FFC533] p-3 flex gap-4 sm:gap-5 shadow-[0_10px_10px_-2px_rgba(207,181,60,0.6)] w-full"
            >
              <img
                src={`/places/${item.file}.png`}
                alt={item.name}
                className="w-28 h-24 sm:w-36 sm:h-32 object-cover border-b-[3px] border-[#FFC533] rounded-[20px] shadow-[0_20px_10px_-2px_rgba(207,181,60,0.6)]"
                onError={(e) => {
                  const file = item.file;

                  if (e.target.src.includes(".png")) {
                    e.target.src = `/places/${file}.jpg`;
                  } else if (e.target.src.includes(".jpg")) {
                    e.target.src = `/places/${file}.webp`;
                  } else {
                    e.target.src = "/placeholder/default.png";
                  }
                }}
              />

              <div className="flex flex-col flex-grow">
                <h3 className="font-semibold style-neuton text-[20px] sm:text-[25px] leading-tight">
                  {item.name}
                </h3>
                <p className="text-black style-poppins text-[12px] sm:text-[15px] mt-1">
                  Address: {item.address}
                </p>
                <p className="text-black style-poppins text-[12px] sm:text-[14px] font-bold mt-1">
                  Get There: {item.time}
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <p className="text-[#FFC533] text-xs sm:text-sm font-medium">
                    {item.rating}
                  </p>
                  <span className="bg-[#CFB53C] text-black style-poppins px-2 py-[2px] rounded-full text-[10px] sm:text-xs">
                    reviews
                  </span>
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border border-[#CFB53C] rounded-t-[10px] shadow-md flex justify-around items-center py-2">
        <button className="text-black">
          <House size={26} />
        </button>
        <button className="text-[#FFC533] hover:text-[#FFC533] transition">
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
