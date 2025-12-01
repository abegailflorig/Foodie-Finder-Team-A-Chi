import { useParams, useNavigate } from "react-router";
import { useEffect, useState, useRef } from "react";
import { Heart } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

export default function RestaurantPage() {
  const { id } = useParams(); // restaurant ID
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);

  // Helper: Build public URL for restaurant/menu images
  const getImageUrl = (path, folder = "restaurant-images") => {
    if (!path) return "/places/placeholder.png";
    if (path.startsWith("http")) return path;
    return `https://ajvlsivsfmtpaogjzaco.supabase.co/storage/v1/object/public/${folder}/${path}`;
  };

  // Load restaurant + menu items
  useEffect(() => {
    const fetchRestaurant = async () => {
      const { data: rest, error: restErr } = await supabase
        .from("restaurants")
        .select("*")
        .eq("id", id)
        .single();
      if (restErr) return console.error(restErr);
      setRestaurant(rest);

      const { data: menu, error: menuErr } = await supabase
        .from("menu_items")
        .select("*")
        .eq("restaurant_id", id);
      if (menuErr) return console.error(menuErr);
      setMenuItems(menu);

      setLoading(false);

      // Initialize map after restaurant loaded
      if (rest.latitude && rest.longitude) initMap(rest.latitude, rest.longitude);
    };

    fetchRestaurant();
  }, [id]);

  // Initialize Google Map
  const initMap = (lat, lng) => {
    if (!window.google) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: parseFloat(lat), lng: parseFloat(lng) },
      zoom: 15,
    });

    new window.google.maps.Marker({
      position: { lat: parseFloat(lat), lng: parseFloat(lng) },
      map,
      title: restaurant.name,
    });
  };

  // Load Google Maps script dynamically
  useEffect(() => {
    if (!restaurant) return;
    // Example coordinates if missing
    const lat = restaurant.latitude || 8.2296; // replace with actual if available
    const lng = restaurant.longitude || 124.2452;

    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCrEanJf45zKlnIhTbZiz_sBN7DMCE-EnE`;
      script.async = true;
      script.defer = true;
      script.onload = () => initMap(lat, lng);
      document.head.appendChild(script);
    } else {
      initMap(lat, lng);
    }
  }, [restaurant]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!restaurant) return <p className="text-center mt-10">Restaurant not found</p>;

  return (
    <div className="min-h-screen bg-white pb-10">
      {/* BANNER */}
      <img
        src={getImageUrl(restaurant.image_url)}
        className="w-full h-48 sm:h-56 object-cover shadow-md"
        style={{ borderTopLeftRadius: "35px", borderTopRightRadius: "35px", marginTop: "20px" }}
      />

      <div className="px-5 mt-2">
        {/* TITLE + ADDRESS */}
        <h2 className="font-semibold text-lg sm:text-xl mt-1">{restaurant.name}</h2>
        <p className="text-[13px] sm:text-sm text-gray-700 leading-5 mt-1">
          <span className="font-semibold">Address:</span> {restaurant.address}
        </p>

        {/* RATING */}
        <div
          className="flex items-center gap-3 mt-2 cursor-pointer"
          onClick={() => navigate(`/restaurant/${id}/feedback`)}
        >
          <p className="text-yellow-500 font-medium text-[13px] sm:text-sm">
            {restaurant.rating.toFixed(1)} {"★".repeat(Math.floor(restaurant.rating))}{"☆".repeat(5 - Math.floor(restaurant.rating))}
          </p>
          <span className="bg-yellow-300 px-3 py-1 rounded-full text-[11px] sm:text-xs">reviews</span>
        </div>

        {/* GOOGLE MAP */}
        <div className="mt-2 w-full h-48 rounded-2xl overflow-hidden border border-yellow-200 shadow-md">
          <div ref={mapRef} className="w-full h-full" />
        </div>

        {/* OUR PRODUCT */}
        <h3 className="font-semibold text-md mt-5 mb-2">Our Product</h3>
        <div className="space-y-4">
          {menuItems.map((p, i) => (
            <div
              key={i}
              className="bg-[#FFF9E8] rounded-2xl p-2 shadow-sm border border-yellow-100 flex items-center gap-3"
            >
              <img
                src={getImageUrl(p.image_url, "menu-items")}
                className="w-20 h-20 object-cover rounded-xl"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-sm sm:text-md">{p.name}</h4>
                <p className="text-yellow-500 text-[12px] sm:text-sm">
                  {p.average_rating ? "★".repeat(Math.floor(p.average_rating)) + "☆".repeat(5 - Math.floor(p.average_rating)) : "★★★★★"}
                </p>
                <p className="text-[13px] sm:text-sm font-medium">₱ {p.price}</p>
              </div>
              <Heart className="text-red-400" fill="red" size={22} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
