import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Heart } from "lucide-react";
import L from "leaflet";
import { supabase } from "../lib/supabaseClient";

export default function RestaurantPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [user, setUser] = useState(null);

  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingCounts, setRatingCounts] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  const getImageUrl = (path) => {
    if (!path) return "/places/placeholder.png";
    if (path.startsWith("http")) return path;
    return `https://ajvlsivsfmtpaogjzaco.supabase.co/storage/v1/object/public/restaurant-images/${path}`;
  };

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUser(data.user);
    })();
  }, []);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    const fetchAll = async () => {
      try {
        const { data: rest, error: restErr } = await supabase
          .from("restaurants")
          .select("*")
          .eq("id", id)
          .single();
        if (restErr) throw restErr;
        setRestaurant(rest);

        const { data: menus } = await supabase
          .from("restaurant_menus")
          .select("id, item_name")
          .eq("restaurant_id", id)
          .order("item_name", { ascending: true });
        setMenuItems(menus || []);

        if (user?.id) {
          const { data: fav } = await supabase
            .from("favorites")
            .select("id")
            .eq("restaurant_id", id)
            .eq("user_id", user.id)
            .maybeSingle();
          setIsFavorite(!!fav);
        }

        const avg = rest?.rating_count
          ? rest.overall_rating / rest.rating_count
          : 0;
        const bucket = Math.min(5, Math.max(1, Math.round(avg || 0)));
        const fallback = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        fallback[bucket] = rest?.rating_count || 0;
        setRatingCounts(fallback);
      } catch (err) {
        console.error("fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id, user]);

  useEffect(() => {
    if (!restaurant) return;
    const lat = Number(restaurant.latitude);
    const lng = Number(restaurant.longitude);
    if (!lat || !lng || !mapRef.current) return;

    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current, { zoomControl: false, attributionControl: false }).setView([lat, lng], 14);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(mapInstance.current);
    } else {
      mapInstance.current.setView([lat, lng], 14);
    }

    mapInstance.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) mapInstance.current.removeLayer(layer);
    });

    L.marker([lat, lng])
      .addTo(mapInstance.current)
      .bindPopup(`<b>${restaurant.name}</b><br/>${restaurant.address}`);
  }, [restaurant]);

  if (loading) return <div className="pt-10 text-center text-base sm:text-lg">Loading...</div>;
  if (!restaurant) return <div className="pt-10 text-center text-base sm:text-lg">Restaurant not found</div>;

  const toggleFavorite = async () => {
    if (!user) { alert("Please sign in to favorite restaurants."); return; }
    try {
      if (isFavorite) {
        await supabase.from("favorites").delete().match({ restaurant_id: Number(id), user_id: user.id });
        setIsFavorite(false);
      } else {
        await supabase.from("favorites").insert({ restaurant_id: Number(id), user_id: user.id });
        setIsFavorite(true);
      }
    } catch (err) {
      console.error("favorite error", err);
      alert("Unable to update favorite.");
    }
  };

  const submitRating = async () => {
    if (!userRating || userRating < 1) {
      alert("Please select a star rating before submitting.");
      return;
    }
    try {
      const newOverall = Number(restaurant.overall_rating || 0) + Number(userRating);
      const newCount = Number(restaurant.rating_count || 0) + 1;

      const { error } = await supabase
        .from("restaurants")
        .update({
          overall_rating: newOverall,
          rating_count: newCount,
        })
        .eq("id", id);
      if (error) throw error;

      setRestaurant((prev) => ({ ...prev, overall_rating: newOverall, rating_count: newCount }));

      const bucket = Math.min(5, Math.max(1, Math.round(userRating)));
      setRatingCounts((prev) => ({ ...prev, [bucket]: (prev[bucket] || 0) + 1 }));

      setUserRating(0);
      alert("Rating submitted. Thank you!");
    } catch (err) {
      console.error("submit rating error", err);
      alert("Unable to submit rating. Try again later.");
    }
  };

  const renderStarsStatic = (ratingNumber) => {
    const full = Math.floor(ratingNumber || 0);
    const half = (ratingNumber - full) >= 0.5;
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= full) stars.push(<span key={i} className="text-yellow-500 text-base sm:text-lg md:text-xl">★</span>);
      else if (i === full + 1 && half) stars.push(<span key={i} className="text-yellow-500 text-base sm:text-lg md:text-xl">⯨</span>);
      else stars.push(<span key={i} className="text-gray-300 text-base sm:text-lg md:text-xl">★</span>);
    }
    return <div className="flex gap-1">{stars}</div>;
  };

  const averageRating = restaurant.rating_count
    ? restaurant.overall_rating / restaurant.rating_count
    : 0;

  const totalRatings = Object.values(ratingCounts).reduce((a, b) => a + b, 0) || restaurant.rating_count || 1;
  const barWidth = (count) => `${Math.round((count / totalRatings) * 100)}%`;

  const renderSelectableStars = () => [1, 2, 3, 4, 5].map((s) => (
    <button key={s} onMouseEnter={() => setHoverRating(s)} onMouseLeave={() => setHoverRating(0)} onClick={() => setUserRating(s)} className="text-lg sm:text-xl md:text-2xl focus:outline-none">
      <span className={s <= (hoverRating || userRating) ? "text-yellow-500" : "text-gray-300"}>★</span>
    </button>
  ));

  const midIndex = Math.ceil(menuItems.length / 2);
  const column1 = menuItems.slice(0, midIndex);
  const column2 = menuItems.slice(midIndex);

  return (
    <div className="min-h-screen bg-[#FFFAE2] pb-10 px-2 sm:px-4 md:px-6">
      {/* Back button */}
      <div className="pt-3">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft size={24} className="sm:w-6 sm:h-6 md:w-7 md:h-7"/>
        </button>
      </div>

      {/* Image */}
      <div className="mt-3 w-full">
        <div className="overflow-hidden shadow-md rounded-t-[25px] sm:rounded-t-[30px] md:rounded-t-[35px]">
          <img src={getImageUrl(restaurant.image_url)} alt={restaurant.name} className="w-full h-40 sm:h-56 md:h-64 object-cover"/>
        </div>
      </div>

      {/* Favorite */}
      <div className="flex flex-col items-center -mt-4 sm:-mt-4">
        <button onClick={toggleFavorite} aria-label="favorite restaurant" className="bg-transparent border-none">
          <Heart size={28} fill={isFavorite ? "#FF7979" : "none"} stroke={isFavorite ? "#FF7979" : "#D1D5DB"} className="transition-colors duration-200"/>
        </button>
      </div>

      {/* Name & Address */}
      <div className="text-center mt-2 px-1 sm:px-2">
        <h1 className="style-neuton text-lg sm:text-2xl md:text-4xl font-semibold">{restaurant.name}</h1>
        <p className="style-poppins text-xs sm:text-sm md:text-base text-gray-700 mt-1">{restaurant.address}</p>
      </div>

      {/* Ratings */}
      <div className="mt-4 w-full px-1 sm:px-2 md:px-4">
        <div className="w-full bg-white rounded-[18px] sm:rounded-[20px] p-3 sm:p-4 flex flex-col sm:flex-row gap-3 shadow-md">
          <div className="w-full sm:w-24 h-24 sm:h-24 rounded-md flex flex-col items-center justify-center mx-auto sm:mx-0">
            <div className="text-lg sm:text-xl md:text-2xl font-bold">{averageRating.toFixed(1)}</div>
            <div className="mt-1">{renderStarsStatic(averageRating)}</div>
            <div className="text-[10px] sm:text-xs md:text-sm text-center text-gray-500 mt-1">
              All rating ({restaurant.rating_count || 0})
            </div>
          </div>
          <div className="flex-1">
            {[5, 4, 3, 2, 1].map((r) => (
              <div key={r} className="flex items-center gap-2 mb-1">
                <div className="w-5 text-xs sm:text-sm font-medium">{r}★</div>
                <div className="flex-1 bg-gray-200 rounded-full h-2 sm:h-3 overflow-hidden">
                  <div className="h-2 sm:h-3 rounded-full bg-yellow-400" style={{ width: barWidth(ratingCounts[r]) }} />
                </div>
                <div className="w-7 text-[10px] sm:text-xs text-right">{ratingCounts[r] || 0}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rate me */}
      <div className="mt-4 w-full px-1 sm:px-2 md:px-4">
        <div className="style-neuton text-base sm:text-lg md:text-xl font-semibold">Rate me:</div>
        <div className="flex gap-2 mt-2 flex-wrap">{renderSelectableStars()}</div>
        <div className="mt-3">
          <button onClick={submitRating} className="style-poppins bg-[#CFB53C] text-black px-4 sm:px-5 py-1 sm:py-2 rounded-full text-xs sm:text-sm md:text-base">
            Submit
          </button>
        </div>
      </div>

      {/* Map */}
      <div className="mt-4 px-1 sm:px-2 md:px-4">
        <div className="style-poppins text-base sm:text-lg md:text-xl font-semibold mb-2">View map:</div>
        <div className="h-32 sm:h-48 md:h-56 rounded-xl overflow-hidden border border-yellow-200 shadow-sm">
          <div ref={mapRef} className="w-full h-full" />
        </div>
      </div>

      {/* 2-column Menu */}
      <div className="mt-4 bg-[#FCE8D8] rounded-xl p-3 sm:p-4 border border-[#CFB53C] shadow-sm">
        <h2 className="style-neuton text-center text-lg sm:text-2xl md:text-3xl font-semibold mb-3">Menu List</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[column1, column2].map((col, idx) => (
            <div key={idx}>
              <table className="w-full style-poppins text-xs sm:text-sm md:text-base border border-[#d6c9b8] rounded-xl overflow-hidden">
                <tbody>
                  {col.length ? col.map((item) => (
                    <tr key={item.id} className="border-b border-black last:border-b-0">
                      <td className="py-2 px-2 sm:py-2 sm:px-3">{item.item_name}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td className="py-3 text-center text-gray-500 italic">No menu</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>

      <div className="h-8" />
    </div>
  );
}
