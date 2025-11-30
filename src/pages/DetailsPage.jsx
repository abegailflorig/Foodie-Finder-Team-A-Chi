import { ArrowLeft } from "lucide-react"; 
import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function DetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [similar, setSimilar] = useState([]);

  useEffect(() => {
    loadDetails();
  }, [id]);

  async function loadDetails() {
    // -----------------------------------------
    // 1. LOAD MAIN MENU ITEM + RESTAURANT
    // -----------------------------------------
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

    if (error) {
      console.error(error);
      return;
    }

    setItem(menuItem);
    setRestaurant(menuItem.restaurant);

    // -----------------------------------------
    // 2. GET THE RECOMMENDATION ID (via bridge table)
    // -----------------------------------------
    const { data: recRow } = await supabase
      .from("menu_item_recommendations")
      .select("recommendation_id")
      .eq("menu_item_id", id)
      .single();

    if (!recRow) return;

    const recommendationId = recRow.recommendation_id;

    // -----------------------------------------
    // 3. GET IDs of all menu_items with SAME recommendation
    // -----------------------------------------
    const { data: relatedLinks } = await supabase
      .from("menu_item_recommendations")
      .select("menu_item_id")
      .eq("recommendation_id", recommendationId);

    if (!relatedLinks || relatedLinks.length === 0) return;

    const ids = relatedLinks.map((r) => r.menu_item_id);

    // Remove itself
    const filteredIds = ids.filter((x) => x !== id);

    if (filteredIds.length === 0) return;

    // -----------------------------------------
    // 4. FETCH MENU ITEMS matching those IDs
    // -----------------------------------------
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

  if (!item) return <p className="p-4">Loading...</p>;

  return (
    <div className="flex flex-col min-h-screen bg-white relative overflow-hidden">

      <button onClick={() => navigate(-1)} className="mb-3 ml-3">
        <ArrowLeft size={28} />
      </button>

      <div className="bg-[#FFC533] w-[350px] md:w-[700px] rounded-t-[70px] shadow-md mx-auto mt-20 p-6 pt-40 relative flex flex-col items-center">

        {/* DISCOUNT BADGE ON HEADER */}
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
          <p className="text-[30px] font-bold text-black leading-tight">
            {item.name}
          </p>

          <p className="text-[18px] text-gray-800 -mt-2 ml-6">
            – {restaurant?.name}
          </p>

          {item.description && (
            <p className="text-gray-700 mt-2 ml-6">{item.description}</p>
          )}

          <p className="text-[32px] font-bold text-gray-900 mt-3">
            ₱{item.price}
          </p>
        </div>
      </div>

      {similar.length > 0 && (
        <div className="mt-6 px-4 flex flex-col">
          <h2 className="text-black mb-3 text-[26px] font-semibold">
            Similar Dish
          </h2>

          <div className="grid grid-cols-2 gap-6 pb-20">
            {similar.map((sim) => (
              <div
                key={sim.id}
                onClick={() => navigate(`/details/${sim.id}`)}
                className="relative bg-white rounded-2xl border border-b-[4px] border-[#CFB53C] pt-14 sm:pt-18 pb-4 px-2 mt-5 sm:mt-10 flex flex-col items-center shadow-lg cursor-pointer"
              >

                {/* DISCOUNT BADGE FOR SIMILAR ITEMS */}
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
                  <h3 className="font-semibold text-gray-900 text-[20px]">
                    {sim.name}
                  </h3>
                  <p className="text-gray-600 text-sm -mt-1">
                    – {sim.restaurant?.name}
                  </p>
                  <p className="text-black font-semibold text-lg mt-5 sm:mt-6">
                    ₱ {sim.price}
                  </p>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
