import { X, Star } from "lucide-react";

export default function ResFeedback() {
  const reviews = [
    {
      name: "Abegail",
      time: "1 month ago",
      review: "I was really impressed by the service at Mui’s Cupsilog",
      img: "/places/Muis2.png", // rename to avoid "'" break
      stars: 5,
    },
    {
      name: "Nina Mae",
      time: "2 months ago",
      review: "I loved the music and the stylish decor",
      img: "/places/Muis1.png",
      stars: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-white p-5 font-serif">

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <X size={28} />
        <h1 className="text-2xl font-bold">Rating & Reviews</h1>
      </div>

      <h2 className="text-xl text-center mb-3 font-bold">Mui’s Cupsilog</h2>

      {/* Top image (Rounded Top Only) */}
      <img
        src="/places/Muis.png"
        alt="Restaurant"
        className="w-full h-55 object-cover rounded-t-full mb-5 shadow-md"
      />

      {/* Rating Summary */}
      <div className="bg-white shadow-lg rounded-2xl p-5 border border-yellow-200 mb-6 flex items-start gap-10">
        <div>
          <p className="text-4xl font-bold">5.0</p>

          <div className="flex text-yellow-500 mt-1 mb-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={20} fill="currentColor" />
            ))}
          </div>

          <p className="text-gray-500 text-sm">All rating (1000+)</p>
        </div>

        <div className="flex-1">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center mb-2 text-sm">
              <span className="w-6">{star}★</span>

              <div className="w-full h-2 bg-gray-200 rounded-full ml-2">
                <div
                  className="h-full bg-yellow-400 rounded-full"
                  style={{
                    width:
                      star === 5 ? "95%" :
                      star === 4 ? "60%" :
                      star === 3 ? "30%" :
                      star === 2 ? "10%" : "5%",
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feedback input */}
      <input
        type="text"
        placeholder="Your Feedback"
        className="w-full border border-yellow-300 rounded-full px-4 py-2 mb-6 shadow-sm"
      />

      <h2 className="text-2xl font-bold mb-3">Reviews</h2>

      {/* Review Cards */}
      <div className="space-y-6">
        {reviews.map((rev, index) => (
          <div
            key={index}
            className="
              bg-yellow-50 rounded-2xl p-6 shadow-md border border-yellow-200 
              drop-shadow-[0_4px_10px_#CFB53C] 
              flex justify-between items-start
              md:flex-row flex-col
              md:gap-0 gap-4
            "
          >
            {/* LEFT — TEXT */}
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-lg">{rev.name}</p>

                <div className="flex text-yellow-500">
                  {[...Array(rev.stars)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>

                <span className="text-gray-400">•</span>
                <p className="text-gray-500 text-sm">{rev.time}</p>
              </div>

              <p className="text-gray-700 text-sm mt-2 leading-snug max-w-lg">
                {rev.review}
              </p>
            </div>

            {/* RIGHT — IMAGE (rounded top corners only) */}
            <div className="w-52 h-32 overflow-hidden rounded-t-full shadow-md flex-shrink-0 self-center md:self-start">
              <img
                src={rev.img}
                alt="Review"
                className="w-full h-full object-cover"
              />
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
