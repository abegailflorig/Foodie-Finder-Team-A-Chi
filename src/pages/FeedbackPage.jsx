import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Star } from "lucide-react";

export default function FeedbackPage() {
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [restaurant, setRestaurant] = useState(null);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) stars.push("★");
      else if (rating + 0.5 >= i) stars.push("⯪");
      else stars.push("☆");
    }
    return stars.join("");
  };

  useEffect(() => {
    async function fetchData() {
      const { data: restaurantData } = await supabase
        .from("restaurants")
        .select("name")
        .eq("id", id)
        .single();
      setRestaurant(restaurantData);

      const { data: reviewData } = await supabase
        .from("reviews")
        .select(`
          id,
          rating,
          review_text,
          created_at,
          profiles ( full_name )
        `)
        .eq("restaurant_id", id)
        .order("created_at", { ascending: false });
      setReviews(reviewData || []);
    }
    fetchData();
  }, [id]);

  if (!restaurant) return <p>Loading...</p>;

  return (
    <div className="px-4 py-6 font-serif">
      <h1 className="text-3xl font-bold mb-4">Rating & Reviews</h1>
      <p className="text-2xl leading-5"><span className="font-bold">{restaurant.name}</span></p>

      {reviews.map((r) => (
        <div key={r.id} className="bg-yellow-50 rounded-2xl p-5 shadow-md mb-6 border border-yellow-200 min-h-[130px] flex items-center">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-semibold">{r.profiles?.full_name || "Anonymous"}</p>
              <div className="flex text-yellow-500">{renderStars(r.rating)}</div>
              <span className="text-gray-400">•</span>
              <p className="text-gray-500 text-xs">{new Date(r.created_at).toLocaleDateString()}</p>
            </div>
            <p className="text-gray-700 text-sm mt-3 leading-snug line-clamp-3">{r.review_text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
