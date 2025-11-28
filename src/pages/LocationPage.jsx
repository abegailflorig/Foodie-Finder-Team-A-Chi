import { ArrowLeft, House, MapPin, Heart, CircleUserRound,Menu } from "lucide-react";

export default function LocationPage() {
  const items = [
    {
      file: "Muis",
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
      <div className="px-4 pt-4 flex flex-col items-start">
        <button className="mb-3">
          <ArrowLeft size={28} className="text-black" />
        </button>

        <input
          type="text"
          placeholder="Search Restaurant"
          className="w-full  sm:w-full text-[16px] sm:text-[18px] px-4 py-2 sm:py-3 border border-t-[#FCE8D8] border-[#FFC533] rounded-full bg-white shadow-md outline-none"
        />
      </div>

      {/* Content */}
      <div className="px-4 mt-4">
        <h2 className="text-[18px] sm:text-[20px] font-semibold style-neuton mb-3">
          Nearby Restaurant
        </h2>

        {/* Restaurant Cards */}
        <div className="space-y-4 pb-28">
          {items.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-t-[#FCE8D8] border-[#FFC533] p-3 flex gap-3 shadow-md w-[full] sm:w-full"
            >
              {/* Image */}
              <img
                src={`/places/${item.file}.png`}
                alt={item.name}
                className="w-50 h-25 md:w-82 md:h-32 object-cover border-b-2 border-[#FFC533] rounded-[28px] shadow-sm flex-shrink-0"
                onError={(e) => {
                  const file = item.file;
                  if (e.target.src.includes(".png")) e.target.src = `/places/${file}.jpg`;
                  else if (e.target.src.includes(".jpg")) e.target.src = `/places/${file}.webp`;
                  else e.target.src = "/placeholder/default.png";
                }}
              />

              {/* Text */}
              <div className="flex flex-col flex-grow">
                <h3 className="font-semibold text-[14px] sm:text-[16px] md:text-[18px] style-neuton leading-tight">
                  {item.name}
                </h3>
                <p className="text-black text-[10px] sm:text-[12px] md:text-[14px] style-poppins mt-1">
                  Address: {item.address}
                </p>
                <p className="text-black text-[10px] sm:text-[12px] md:text-[14px] font-bold mt-1">
                  Get There: {item.time}
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <p className="text-[#FFC533] text-[10px] sm:text-[12px] md:text-[14px] font-medium">
                    {item.rating}
                  </p>
                  <span className="bg-[#CFB53C] text-black px-2 py-[1px] rounded-full text-[8px] sm:text-[10px] md:text-[12px]">
                    reviews
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM NAV */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-yellow-300 rounded-t-3xl shadow-md flex justify-around items-center py-2">
        <button className="text-black hover:text-[#FFC533] transition"><House size={22} /></button>
        <button className="text-black hover:text-[#FFC533] transition"><Menu size={22} /></button>
        <button className="text-[#FFC533] hover:text-black transition"><MapPin size={22} /></button>
        <button className="text-black hover:text-[#FFC533] transition"><Heart size={22} /></button>
        <button className="text-black hover:text-[#FFC533] transition"><CircleUserRound size={22} /></button>
      </div>
    </div>
  );
}
