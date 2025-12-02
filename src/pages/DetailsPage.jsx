import { ArrowLeft, X } from "lucide-react"; 
import { useParams, useNavigate } from "react-router";
import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabaseClient";

export default function DetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newReviewText, setNewReviewText] = useState("");
  const [newRating, setNewRating] = useState(0);

  const reviewsEndRef = useRef(null);

  useEffect(() => {
    loadDetails();
    loadReviews();
  }, [id]);

  async function loadDetails() {
    const { data: menuItem, error } = await supabase
      .from("menu_items")
      .select(`
        id,
        name,
        description,
        price,
        discount,
        image_url,
        restaurant:restaurant_id (
          id,
          name,
          address,
          image_url
        )
      `)
      .eq("id", id)
      .single();

    if (error) return console.error(error);
    setItem(menuItem);
    setRestaurant(menuItem.restaurant);

    const { data: recRow } = await supabase
      .from("menu_item_recommendations")
      .select("recommendation_id")
      .eq("menu_item_id", id)
      .single();

    if (!recRow) return;
    const recommendationId = recRow.recommendation_id;

    const { data: relatedLinks } = await supabase
      .from("menu_item_recommendations")
      .select("menu_item_id")
      .eq("recommendation_id", recommendationId);

    if (!relatedLinks) return;
    const filteredIds = relatedLinks.map(r => r.menu_item_id).filter(x => x !== id);
    if (!filteredIds.length) return;

    const { data: similarItems } = await supabase
      .from("menu_items")
      .select(`
        id,
        name,
        price,
        discount,
        image_url,
        restaurant:restaurant_id (
          id,
          name,
          image_url
        )
      `)
      .in("id", filteredIds);

    setSimilar(similarItems || []);
  }

  async function loadReviews() {
    const { data, error } = await supabase
      .from("menu_item_reviews")
      .select("id, user_id, rating, review_text, created_at, user: user_id (full_name)")
      .eq("menu_item_id", id)
      .order("created_at", { ascending: false });

    if (error) return console.error(error);

    setReviews((data || []).map(r => ({
      ...r,
      rating: parseFloat(r.rating)
    })));
  }

  const handleAddReview = async () => {
    if (!newReviewText || newRating <= 0) {
      alert("Please provide a rating and review text.");
      return;
    }

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || null;

    const { data, error } = await supabase
      .from("menu_item_reviews")
      .insert([{
        menu_item_id: id,
        user_id: userId,
        rating: newRating,
        review_text: newReviewText,
      }])
      .select();

    if (error) return console.error(error);

    // Add new review to top of the list
    const newRev = { ...data[0], user: { full_name: "You" } };
    setReviews(prev => [newRev, ...prev]);
    setNewReviewText("");
    setNewRating(0);

    // Scroll to newly added review
    setTimeout(() => {
      reviewsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  if (!item) return <p className="p-4">Loading...</p>;

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const renderStars = (rating, editable = false, setRatingFn = null) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
  let starIcon = "☆";               // default outline
  let className = "text-gray-400";  // empty star color
  let style = {};                    // inline style for full star

  if (rating >= i) {
    starIcon = "★";                 // full star
    className = "text-yellow-500";  // filled yellow
    style = {
      WebkitTextStroke: "1px black", // black border
      textStroke: "1px black"
    };
  } else if (rating + 0.5 >= i) {
    starIcon = "⯨";                 // half star
    className = "text-yellow-500";  // half star yellow
  }

  stars.push(
    <span
      key={i}
      className={`${className} text-[20px] sm:text-[30px] ${editable ? "cursor-pointer" : ""}`}
      style={style}
      onClick={() => editable && setRatingFn(i)}
    >
      {starIcon}
    </span>
  );
}


  return stars;
};

  return (
    <div className="flex flex-col min-h-screen bg-white relative overflow-hidden">
      <button onClick={() => navigate(-1)} className="mb-3 ml-3">
        <ArrowLeft size={28} />
      </button>

      <div className="bg-[#FFC533] w-[350px] md:w-[700px] rounded-t-[70px] shadow-md mx-auto mt-20 p-6 pt-40 relative flex flex-col items-center">
        {item.discount > 0 && (
          <span className="style-neuton absolute -bottom-3 -right-1 bg-[#CFB53C] text-black text-xl sm:text-xl font-bold px-3 py-1 rounded-full shadow-lg z-20">
            {item.discount}% off
          </span>
        )}

        <div className="absolute -top-20 left-1/2 -translate-x-1/2">
          <img
            src={item.image_url || "/images/default-food.png"}
            className="w-50 h-54 object-cover rounded-full"
          />
        </div>

        <div className="w-full text-left">
          <p className="text-[30px] font-bold style-neuton text-black leading-tight ml-2">{item.name}</p>
          <p className="text-[18px] text-black -mb-2 ml-6 sm:ml-4 style-poppins font-regular">– {restaurant?.name}</p>
          {item.description && <p className="text-gray-800 mt-2 ml-10">{item.description}</p>}

          {/* ⭐ AVERAGE RATING WITH CLICK */}
          <div className="flex items-center gap-2 text-[10px] ml-24 sm:ml-100 mt-2 cursor-pointer " onClick={() => setIsModalOpen(true)}>
            {renderStars(avgRating)}
            <span className="text-black text-[15px] sm:text-[18px]">({reviews.length} reviews)</span>
          </div>

          {item.discount > 0 ? (
            <div className="mt-3 ml-2 style-neuton">
              <p className="line-through text-black text-[22px] sm:text-xl">₱{item.price.toFixed(2)}</p>
              <p className="font-bold text-red-600 text-[30px] sm:text-[32px]">
                ₱{(item.price - (item.price * item.discount) / 100).toFixed(2)}
              </p>
            </div>
          ) : (
            <p className="text-[32px] font-bold text-gray-900 mt-3 style-neuton ml-2">₱{item.price.toFixed(2)}</p>
          )}
        </div>
      </div>

      {/* REVIEWS MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#FFC533] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-11/12 md:w-2/3 max-h-[80vh] overflow-y-auto rounded-xl p-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-700"
            >
              <X size={24} />
            </button>

            <h2 className="text-black text-[24px] font-semibold mb-4 text-center">
              Rating & Reviews
            </h2>

            {/* Average Rating */}
            <div className="bg-yellow-50 p-4 rounded-xl mb-4 border border-yellow-200">
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold">{avgRating.toFixed(1)}</p>
                <div className="flex items-center gap-1">{renderStars(avgRating)}</div>
              </div>
              <p className="text-gray-500 text-sm mt-1">
                All ratings ({reviews.length}+)
              </p>

              {/* Rating breakdown */}
              <div className="mt-3 space-y-1">
                {[5,4,3,2,1].map((star) => {
                  const percent = reviews.length
                    ? (reviews.filter(r => Math.round(r.rating) === star).length / reviews.length) * 100
                    : 0;
                  return (
                    <div key={star} className="flex items-center gap-2 text-sm">
                      <span className="w-6">{star}☆</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-full bg-yellow-400 rounded-full"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Add Review Input */}
            <div className="mb-6 p-4 border border-gray-300 rounded-xl bg-gray-50">
              <h3 className="text-black font-semibold mb-2">Write a Review</h3>
              
              <div className="flex items-center gap-2 mb-2">
                {renderStars(newRating, true, setNewRating)}
                <span className="text-gray-500">({newRating})</span>
              </div>

              <textarea
                value={newReviewText}
                onChange={(e) => setNewReviewText(e.target.value)}
                placeholder="Write your review here..."
                className="w-full h-15 border border-gray-300 rounded-lg p-2 text-sm mb-2"
              />

              <button
                onClick={handleAddReview}
                className="bg-[#FFC533] text-black font-semibold px-4 py-2 rounded-lg hover:bg-yellow-400 transition"
              >
                Submit
              </button>
            </div>

            {/* Review Cards */}
            <div className="flex flex-col gap-4">
              {reviews.length === 0 && (
                <p className="text-gray-500 text-center">No reviews yet.</p>
              )}

              {reviews.map((rev, index) => (
                <div
                  key={rev.id}
                  ref={index === 0 ? reviewsEndRef : null} 
                  className="bg-yellow-50 border border-yellow-200 rounded-xl flex items-center justify-between p-3 shadow-md"
                >
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-800">{rev.user?.full_name || "Anonymous"}</p>
                      <div className="flex text-yellow-500">{renderStars(rev.rating)}</div>
                      <span className="text-gray-400">•</span>
                      <p className="text-gray-500 text-xs">{new Date(rev.created_at).toLocaleDateString()}</p>
                    </div>
                    <p className="text-gray-700 text-sm">{rev.review_text}</p>
                  </div>

                  <div className="w-24 h-24 rounded-xl overflow-hidden relative flex-shrink-0">
                    <img
                      src={item.image_url || "/images/default-food.png"}
                      alt="Dish"
                      className="w-full h-full object-cover"
                    />
                    {item.discount > 0 && (
                      <span className="absolute bottom-1 left-1 bg-[#CFB53C] text-black text-xs font-bold px-2 py-1 rounded-full">
                        {item.discount}% off
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SIMILAR ITEMS */}
      {similar.length > 0 && (
        <div className="mt-6 px-4 flex flex-col">
          <h2 className="text-black mb-6 sm:mb-3 text-[26px] sm:text-[35px] font-regular style-neuton">Similar Dish</h2>
          <div className="grid grid-cols-2 gap-6 pb-20 ">
            {similar.map((sim) => (
              <div
                key={sim.id}
                onClick={() => navigate(`/details/${sim.id}`)}
                className="relative bg-white rounded-2xl border border-b-[5px] border-[#CFB53C] pt-14 sm:pt-18 pb-4 px-2 mt-5 sm:mt-10 flex flex-col items-center cursor-pointer"
                style={{ boxShadow: "10px 15px 100px #CFB53C" }}
              >
                {sim.discount > 0 && (
                  <span className="style-neuton absolute bottom-7 sm:bottom-12 right-10 sm:right-115 bg-[#CFB53C] text-black text-s sm:text-m font-bold px-2 py-1 rounded-full shadow-lg z-20">
                    {sim.discount}% off
                  </span>
                )}

                <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                  <img
                    src={sim.image_url}
                    className="w-45 sm:w-44 h-30 sm:h-35 object-cover rounded-xl"
                  />
                </div>

                <div className="mt-10 sm:mt-16 w-full text-left">
                  <h3 className="font-semibold text-gray-900 text-[20px] sm:text-[30px] style-neuton">{sim.name}</h3>
                  <p className="text-gray-600 text-s sm:text-[18px] -mt-1 ml-2 style-poppins">– {sim.restaurant?.name}</p>
                  
                  {sim.discount > 0 ? (
                    <div className="mt-5 sm:mt-6 ml-2 style-neuton">
                      <p className="line-through text-black text-[16px] sm:text-[20px]">₱{sim.price.toFixed(2)}</p>
                      <p className="font-bold text-red-600 text-[22px] sm:text-[28px]">
                        ₱{(sim.price - (sim.price * sim.discount) / 100).toFixed(2)}
                      </p>
                    </div>
                  ) : (
                    <p className="text-black font-semibold text-lg sm:text-[30px] mt-5 sm:mt-6 style-neuton">₱{sim.price.toFixed(2)}</p>
                  )}

                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
