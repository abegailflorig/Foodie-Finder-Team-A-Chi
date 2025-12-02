import { X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabaseClient";
import { useParams, useNavigate } from "react-router";

export default function ResFeedback() {
  const { id } = useParams(); // restaurantId
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReviewText, setNewReviewText] = useState("");
  const [newRating, setNewRating] = useState(0); // allow .5 increments (1.0 .. 5.0)
  const reviewsEndRef = useRef(null);

  useEffect(() => {
    loadRestaurant();
    loadReviews();
  }, [id]);

  const loadRestaurant = async () => {
    const { data, error } = await supabase
      .from("restaurants")
      .select("id, name, image_url, overall_rating")
      .eq("id", id)
      .single();
    if (error) return console.error(error);
    setRestaurant(data);
  };

  const loadReviews = async () => {
    const { data, error } = await supabase
      .from("reviews")
      .select("id, rating, review_text, created_at, user: user_id (full_name, profile_pic)")
      .eq("restaurant_id", id)
      .order("created_at", { ascending: false });
    if (error) return console.error(error);
    setReviews(data || []);
  };

  const handleAddReview = async () => {
    if (!newReviewText || newRating <= 0) {
      alert("Please provide a rating and review text.");
      return;
    }

    // Enforce DB minimum rating of 1
    const ratingToInsert = newRating < 1 ? 1 : newRating;

    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      alert("You must be logged in to submit a review.");
      return;
    }

    const userId = userData.user.id;

    // Check if user already reviewed
    const { data: existingReview } = await supabase
      .from("reviews")
      .select("*")
      .eq("restaurant_id", id)
      .eq("user_id", userId)
      .single();

    if (existingReview) {
      alert("You have already submitted a review for this restaurant.");
      return;
    }

    // Insert new review
    const { data: reviewData, error: insertError } = await supabase
      .from("reviews")
      .insert([{
        restaurant_id: id,
        user_id: userId,
        rating: ratingToInsert,
        review_text: newReviewText
      }])
      .select();

    if (insertError) {
      console.error(insertError);
      alert("Failed to submit review: " + insertError.message);
      return;
    }

    // After insert, refresh reviews and restaurant (triggers in DB should update overall_rating / menu averages)
    await loadReviews();
    await loadRestaurant();

    setNewReviewText("");
    setNewRating(0);

    // scroll to top (newest)
    setTimeout(() => reviewsEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  // Render stars using Unicode. If editable is true, clicking selects half/full by click position.
  const renderStars = (rating, editable = false, setRatingFn = null, sizeClass = "text-[20px]") => {
    const val = typeof rating === "number" ? rating : 0;
    const full = Math.floor(val);
    const hasHalf = val - full >= 0.5;
    const stars = [];

    const onStarClick = (e, idx) => {
      if (!editable || !setRatingFn) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      let newVal = clickX < rect.width / 2 ? idx - 0.5 : idx; // idx is 1..5
      if (newVal < 1) newVal = 1; // enforce DB constraint
      setRatingFn(newVal);
    };

    for (let i = 1; i <= 5; i++) {
      let icon = "☆";
      let className = "text-gray-400";
      let style = {};

      if (i <= full) {
        icon = "★";
        className = "text-yellow-500";

      } else if (hasHalf && i === full + 1) {
        icon = "⯨";
        className = "text-yellow-500";
      }

      stars.push(
        <span
          key={i}
          className={`${sizeClass} ${className} ${editable ? "cursor-pointer" : ""} inline-block`}
          style={style}
          onClick={(e) => editable && onStarClick(e, i)}
          role={editable ? "button" : undefined}
          aria-label={editable ? `Rate ${i} star${i>1?"s":""}` : undefined}
        >
          {icon}
        </span>
      );
    }

    return stars;
  };

  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + parseFloat(r.rating), 0) / reviews.length
    : 0;

  // histogram percentages
  const histogram = [5,4,3,2,1].map(star => {
    const count = reviews.filter(r => Math.round(parseFloat(r.rating)) === star).length;
    const percent = reviews.length ? (count / reviews.length) * 100 : 0;
    return { star, count, percent };
  });

  return (
    <div className="min-h-screen bg-white p-5 font-serif">
      <button onClick={() => navigate(`/restaurant/${id}`)} className="mb-3 ml-3">
        <X size={28} />
      </button>

      <h1 className="text-2xl font-bold text-center mb-3">{restaurant?.name || "Restaurant"}</h1>

      {/* Restaurant Image */}
      <img
        src={restaurant?.image_url || "/places/Muis.png"}
        alt="Restaurant"
        className="w-full h-55 object-cover rounded-t-[100px] mb-5 shadow-md"
      />

      {/* Rating Summary */}
      <div className="bg-white shadow-lg rounded-2xl p-5 border-t-[#FCE8D8] border-[#D3BB4A] border-b-2 drop-shadow-[0_1px_2px_#FFC533] mb-6 flex items-start gap-10">
        <div>
          <p className="text-4xl font-bold">{avgRating ? avgRating.toFixed(1) : "0.0"}</p>
          <div className="flex text-yellow-500 mt-1 mb-1">{renderStars(avgRating, false, null, "text-[22px]")}</div>
          <p className="text-gray-500 text-sm">All rating ({reviews.length})</p>
        </div>

        <div className="flex-1">
          {histogram.map(h => (
            <div key={h.star} className="flex items-center mb-2 text-sm">
              <span className="w-6">{h.star}☆</span>
              <div className="w-full h-2 bg-gray-200 rounded-full ml-2">
                <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${h.percent}%` }} />
              </div>
              <span className="ml-2 text-gray-500">{h.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Feedback input */}
      <textarea
        placeholder="Your Feedback"
        value={newReviewText}
        onChange={(e) => setNewReviewText(e.target.value)}
        className="w-full border border-t-[#FCE8D8] border-[#D3BB4A] border-b-2 rounded-full px-5 py-1 mb-2 drop-shadow-[0_1px_2px_#FFC533] focus:outline-none"
      />

      {/* Star Rating Input - interactive half-star */}
      <div className="flex items-center gap-2 mb-4">
        {renderStars(newRating, true, setNewRating, "text-[26px]")}
        <span className="text-gray-500">({newRating})</span>
      </div>

      <button
        onClick={handleAddReview}
        className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded-lg hover:bg-yellow-500 transition mb-6"
      >
        Submit
      </button>

      <h2 className="text-2xl font-bold mb-3">Reviews</h2>

      {/* Review Cards */}
      <div className="space-y-6">
        {reviews.length === 0 && <p className="text-gray-500 text-center">No reviews yet.</p>}
        {reviews.map((rev, index) => (
          <div
            key={rev.id}
            ref={index === 0 ? reviewsEndRef : null}
            className="bg-yellow-50 rounded-2xl p-6 shadow-md border border-yellow-200 flex justify-between items-start md:flex-row flex-col md:gap-0 gap-4"
          >
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-lg">{rev.user?.full_name || "Anonymous"}</p>
                <div className="flex text-yellow-500">{renderStars(parseFloat(rev.rating), false, null, "text-[18px]")}</div>
                <span className="text-gray-400">•</span>
                <p className="text-gray-500 text-sm">{new Date(rev.created_at).toLocaleDateString()}</p>
              </div>
              <p className="text-gray-700 text-sm mt-2 leading-snug max-w-lg">{rev.review_text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
