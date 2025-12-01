import { ArrowLeft, X } from "lucide-react"; 
import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function DetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  if (!item) return <p className="p-4">Loading...</p>;

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) stars.push(<span key={i} className="text-black text-[20px] sm:text-[30px]">★</span>);
      else if (rating + 0.5 >= i) stars.push(<span key={i} className="text-black text-[18px] sm:text-[28px]">⯨</span>);
      else stars.push(<span key={i} className="text-black text-[16px] sm:text-[26px]">☆</span>);
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
          <span className="absolute -bottom-3 -right-1 bg-[#CFB53C] text-black text-sm font-bold px-3 py-1 rounded-full shadow-lg z-20">
            {item.discount}% OFF
          </span>
        )}

        <div className="absolute -top-20 left-1/2 -translate-x-1/2">
          <img
            src={item.image_url || "/images/default-food.png"}
            className="w-50 h-54 object-cover rounded-full"
          />
        </div>

        <div className="w-full text-left">
          <p className="text-[30px] font-bold text-black leading-tight">{item.name}</p>
          <p className="text-[18px] text-black -mb-2 ml-6">– {restaurant?.name}</p>
          {item.description && <p className="text-gray-700 mt-2 ml-10">{item.description}</p>}

          {/* ⭐ AVERAGE RATING WITH CLICK */}
          <div className="flex items-center gap-2 ml-28 sm:ml-100 mt-2 cursor-pointer " onClick={() => setIsModalOpen(true)}>
            {renderStars(avgRating)}
            <span className="text-black text-sm">({reviews.length} reviews)</span>
          </div>

          <p className="text-[32px] font-bold text-gray-900 mt-3">₱{item.price}</p>
        </div>
      </div>

      {/* REVIEWS MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#FFC533] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-11/12 md:w-2/3 max-h-[80vh] overflow-y-auto rounded-xl p-6 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-700">
              <X size={24} />
            </button>
            <h2 className="text-black text-[24px] font-semibold mb-4">User Reviews</h2>
            <div className="flex flex-col gap-3">
              {reviews.map((rev) => (
                <div key={rev.id} className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-semibold text-gray-800">{rev.user?.full_name || "Anonymous"}</p>
                    <div className="flex items-center gap-1">{renderStars(rev.rating)}</div>
                  </div>
                  <p className="text-gray-600 text-sm">{rev.review_text}</p>
                  <p className="text-gray-400 text-xs mt-1">{new Date(rev.created_at).toLocaleDateString()}</p>
                </div>
              ))}
              {reviews.length === 0 && <p className="text-gray-500">No reviews yet.</p>}
            </div>
          </div>
        </div>
      )}

      {/* SIMILAR ITEMS */}
      {similar.length > 0 && (
        <div className="mt-6 px-4 flex flex-col">
          <h2 className="text-black mb-3 text-[26px] font-semibold">Similar Dish</h2>
          <div className="grid grid-cols-2 gap-6 pb-20">
            {similar.map((sim) => (
              <div
                key={sim.id}
                onClick={() => navigate(`/details/${sim.id}`)}
                className="relative bg-white rounded-2xl border border-b-[4px] border-[#CFB53C] pt-14 sm:pt-18 pb-4 px-2 mt-5 sm:mt-10 flex flex-col items-center shadow-lg cursor-pointer"
              >
                {sim.discount > 0 && (
                  <span className="absolute bottom-5 sm:bottom-10 right-12 sm:right-140 bg-[#CFB53C] text-black text-xs font-bold px-2 py-1 rounded-full shadow-lg z-20">
                    {sim.discount}% OFF
                  </span>
                )}

                <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                  <img
                    src={sim.image_url}
                    className="w-45 sm:w-44 h-30 sm:h-35 object-cover rounded-xl"
                  />
                </div>

                <div className="mt-10 sm:mt-16 w-full text-left">
                  <h3 className="font-semibold text-gray-900 text-[20px]">{sim.name}</h3>
                  <p className="text-gray-600 text-sm -mt-1">– {sim.restaurant?.name}</p>
                  <p className="text-black font-semibold text-lg mt-5 sm:mt-6">₱ {sim.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
