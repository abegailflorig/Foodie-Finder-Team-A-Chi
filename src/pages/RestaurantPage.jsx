import { useParams, useNavigate } from "react-router"; 
import { useEffect, useState, useRef } from "react";
import { ArrowLeft, Heart } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import L from "leaflet";

export default function RestaurantPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState({});
  const [restaurantLocation, setRestaurantLocation] = useState(null);

  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  const getImageUrl = (path, folder = "restaurant-images") => {
    if (!path) return "/places/placeholder.png";
    if (path.startsWith("http")) return path;
    return `https://ajvlsivsfmtpaogjzaco.supabase.co/storage/v1/object/public/${folder}/${path}`;
  };

  // Fetch restaurant, menu items, location
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch restaurant
        const restRes = await supabase.from("restaurants").select("*").eq("id", id).single();
        if (restRes.error) throw restRes.error;
        setRestaurant(restRes.data);

        // Fetch menu items from restaurant_menus table
        const menuRes = await supabase
          .from("restaurant_menus")
          .select("id, item_name")
          .eq("restaurant_id", id)
          .order("item_name");
        if (menuRes.error) throw menuRes.error;
        setMenuItems(menuRes.data);

        // Fetch restaurant coordinates
        if (restRes.data.latitude && restRes.data.longitude) {
          setRestaurantLocation({
            lat: parseFloat(restRes.data.latitude),
            lng: parseFloat(restRes.data.longitude),
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Initialize Leaflet map
  useEffect(() => {
    if (!restaurant || !mapRef.current || !restaurantLocation) return;

    const { lat, lng } = restaurantLocation;

    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView([lat, lng], 15);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap",
      }).addTo(mapInstance.current);
    } else {
      mapInstance.current.setView([lat, lng], 15);
    }

    // Remove previous markers
    mapInstance.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) mapInstance.current.removeLayer(layer);
    });

    L.marker([lat, lng])
      .addTo(mapInstance.current)
      .bindPopup(
        `<b>${restaurant.name}</b><br>${restaurant.address}<br><img src="${getImageUrl(
          restaurant.image_url
        )}" width="100"/>`
      );
  }, [restaurant, restaurantLocation]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!restaurant) return <p className="text-center mt-10">Restaurant not found</p>;

  const toggleFavorite = (id) => setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));

  // Render stars for rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = rating && rating - fullStars >= 0.5;

    for (let i = 1; i <= 5; i++) {
      let starIcon = "☆"; // empty
      let className = "text-gray-400";
      let style = { fontSize: "28px" };

      if (rating) {
        if (i <= fullStars) {
          starIcon = "★"; // full star
          className = "text-yellow-500";
        } else if (hasHalfStar && i === fullStars + 1) {
          starIcon = "⯨"; // half star
          className = "text-yellow-500";
        }
      }

      stars.push(
        <span key={i} className={`${className}`} style={style}>
          {starIcon}
        </span>
      );
    }

    return stars;
  };

  return (
    <div className="min-h-screen bg-white pb-10">
      <button onClick={() => navigate("/locationpage")} className="mb-3 ml-3">
        <ArrowLeft size={28} />
      </button>

      <img
        src={getImageUrl(restaurant.image_url)}
        className="w-full h-48 sm:h-56 object-cover shadow-md"
        style={{ borderTopLeftRadius: "35px", borderTopRightRadius: "35px", marginTop: "20px" }}
      />

      <div className="px-5 mt-2">
        <h2 className="style-neuton font-semibold text-[30px] sm:text-[32px] mt-1">{restaurant.name}</h2>
        <p className="style-poppins text-[15px] sm:text-[16px] text-gray-700 mt-1 ml-3 sm:ml-5">
          <span className="font-semibold">Address:</span> {restaurant.address}
        </p>

        <div
          className="flex items-center gap-3 mt-2 cursor-pointer"
          onClick={() => navigate(`/restaurant/${id}/feedback`)}
        >
          <p className="flex items-center gap-2 text-sm sm:text-base">
            {restaurant.rating && (
              <span className="text-[15px] sm:text-[16px] mr-1">{restaurant.rating.toFixed(1)}</span>
            )}
            {renderStars(restaurant.rating)}
          </p>
          <span className="bg-[#CFB53C] px-3 py-1 rounded-full text-[14px] sm:text-xs">reviews</span>
        </div>

        <div className="mt-2 w-full h-48 rounded-2xl overflow-hidden border border-yellow-200 shadow-md">
          <div ref={mapRef} className="w-full h-full" />
        </div>

        <h3 className="style-neuton font-semibold text-[30px] mt-5 mb-2">Menu</h3>

        {/* Display menu items in 2 columns */}
        <div className="grid grid-cols-2 gap-3">
          {menuItems.map((p) => (
            <div
              key={p.id}
              className="bg-[#FFF9E8] rounded-2xl p-3 shadow-sm border border-yellow-100 flex flex-col gap-2"
            >
              <h4 className="font-semibold text-sm sm:text-[16px] truncate">{p.item_name}</h4>
              <Heart
                className={`cursor-pointer ${favorites[p.id] ? "text-red-500" : "text-gray-300"}`}
                onClick={() => toggleFavorite(p.id)}
                size={22}
                fill={favorites[p.id] ? "red" : "none"}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
