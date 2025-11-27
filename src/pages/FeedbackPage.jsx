import React from "react";
import { Star } from "lucide-react";

const reviews = [
  {
    name: "Abegail",
    time: "1 month ago",
    text: "food quality, service, and atmosphere",
    price: 250,
    
  },
  {
    name: "Nina Mae",
    time: "2 months ago",
    text: "fresh ingredients, and unbeatable prices!",
    price: 250,
  },
];

export default function FeedbackPage() {
const ReviewCard = ({ name, time, text }) => {
  return (
    <div className="w-full sm:w-[90%] md:w-[80%]">
      <div className="bg-yellow-50 rounded-2xl p-5 shadow-md mb-6 border border-yellow-200 drop-shadow-[0_4px_10px_#CFB53C] min-h-[130px] flex items-center">

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold">{name}</p>

            <div className="flex text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="currentColor" />
              ))}
            </div>

            <span className="text-gray-400">•</span>
            <p className="text-gray-500 text-xs">{time}</p>
          </div>

          <p className="text-gray-700 text-sm mt-3 leading-snug line-clamp-3">
            {text}
          </p>
        </div>

      </div>
    </div>
  );
};



  return (
    <div className="px-4 py-6 font-serif">
      {/* TITLE */}
      <h1 className="text-3xl font-bold mb-4">Rating & Reviews</h1>
      <p className="text-2xl leading-5">
        <span className="font-bold">Kinilaw na Tuna -</span>
        <span className="font-[Poppins]"> Avodah Kitchen </span>
      </p>

      {/* RATING SUMMARY */}
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
                  style={{ width: star * 15 + "%" }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FEEDBACK INPUT */}
      <input
        type="text"
        placeholder="Your Feedback"
        className="w-full border border-yellow-300 rounded-full px-4 py-2 mb-6 shadow-sm"
      />

      {/* REVIEWS TITLE */}
      <h2 className="text-2xl font-bold mb-3">Reviews</h2>

      {/* REVIEW CARDS */}
      {reviews.map((r, i) => (
        <ReviewCard key={i} {...r} />
      ))}
    </div>
  );
}
