import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { House, MapPin, Heart, CircleUserRound, X } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

const LOCATIONIQ_KEY = "pk.1526e4b7f7d13fc301eec3ef3492c130";

export default function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [addressInput, setAddressInput] = useState("");
  const [location, setLocation] = useState({ lat: 14.5995, lng: 120.9842 }); // Manila
  const [suggestions, setSuggestions] = useState([]);

  // ---------------- REVERSE GEOCODE ----------------
  async function reverseGeocode(lat, lng) {
    try {
      const res = await fetch(
        `https://us1.locationiq.com/v1/reverse.php?key=${LOCATIONIQ_KEY}&lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();
      return data?.display_name || "";
    } catch (err) {
      console.error("Reverse geocode failed", err);
      return "";
    }
  }

  // ---------------- SESSION CHECK ----------------
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      setUser({ id: session.user.id });

      const popupShown = sessionStorage.getItem("locationPopupShown");
      if (!popupShown) {
        setShowLocationPopup(true);
        sessionStorage.setItem("locationPopupShown", "true");
      }

      await getCurrentUser(session.user.id);
    };
    checkSession();
  }, []);

  async function getCurrentUser(userId) {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("latitude, longitude, address")
        .eq("id", userId)
        .single();

      const lat = profile?.latitude ? parseFloat(profile.latitude) : location.lat;
      const lng = profile?.longitude ? parseFloat(profile.longitude) : location.lng;

      setLocation({ lat, lng });
      setAddressInput(profile?.address || "");

      loadCategories();
      loadAllRestaurants(lat, lng);
    } catch (err) {
      console.error(err);
      setShowLocationPopup(true);
    }
  }

  async function loadCategories() {
    const { data } = await supabase
      .from("restaurant_categories")
      .select("*")
      .order("name");
    setCategories(data || []);
  }

  async function loadAllRestaurants(userLat, userLng) {
    const { data } = await supabase.from("restaurants").select("*");

    const withDistance = (data || []).map((r) => ({
      ...r,
      distance: getDistance(
        userLat,
        userLng,
        parseFloat(r.latitude),
        parseFloat(r.longitude)
      ),
    }));

    withDistance.sort((a, b) => a.distance - b.distance);
    setRestaurants(withDistance);
    setFilteredRestaurants(withDistance);
  }

  function getDistance(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  function handleCategoryClick(categoryId) {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
      setFilteredRestaurants(restaurants);
      return;
    }

    setSelectedCategory(categoryId);
    const filtered = restaurants.filter((r) => r.category_id === categoryId);
    filtered.sort((a, b) => a.distance - b.distance);
    setFilteredRestaurants(filtered);
  }

  async function fetchSuggestions(query) {
    if (!query.trim()) return setSuggestions([]);

    try {
      const res = await fetch(
        `https://us1.locationiq.com/v1/autocomplete.php?key=${LOCATIONIQ_KEY}&q=${encodeURIComponent(
          query
        )}&format=json`
      );
      const data = await res.json();
      setSuggestions(data || []);
      if (data?.[0]) setLocation({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
    } catch (err) {
      console.error("Autocomplete failed", err);
      setSuggestions([]);
    }
  }

  async function saveLocation(selectedLat, selectedLng, selectedAddress) {
    const lat = selectedLat || location.lat;
    const lng = selectedLng || location.lng;

    let address = selectedAddress || addressInput;
    if (!address) {
      address = await reverseGeocode(lat, lng);
      setAddressInput(address);
    }

    if (!user?.id || !address) return;

    await supabase
      .from("profiles")
      .update({ latitude: lat, longitude: lng, address })
      .eq("id", user.id);

    setLocation({ lat, lng });
    setAddressInput(address);
    setShowLocationPopup(false);
    loadAllRestaurants(lat, lng);
  }

  function DraggableMarker() {
    const [position, setPosition] = useState(location);
    const map = useMap();

    useEffect(() => {
      map.flyTo([location.lat, location.lng], 13, { duration: 1 });
      setPosition(location);
    }, [location, map]);

    const eventHandlers = {
      async dragend(e) {
        const latLng = e.target.getLatLng();
        const newPos = { lat: latLng.lat, lng: latLng.lng };
        setPosition(newPos);
        setLocation(newPos);
        const addr = await reverseGeocode(newPos.lat, newPos.lng);
        if (addr) setAddressInput(addr);
      },
    };

    return <Marker position={position} draggable={true} eventHandlers={eventHandlers} />;
  }

  function renderStars(rating) {
    const roundedRating = Math.min(5, Math.max(0, Math.round(rating * 2) / 2));
    const filledStars = Math.floor(roundedRating);
    const halfStar = roundedRating % 1 !== 0;
    const emptyStars = 5 - filledStars - (halfStar ? 1 : 0);
    let stars = "★".repeat(filledStars);
    if (halfStar) stars += "★";
    stars += "☆".repeat(emptyStars);
    return stars;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    sessionStorage.removeItem("locationPopupShown");
    window.location.href = "/landing";
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* LOCATION POPUP */}
      {showLocationPopup && (
        <div className="fixed inset-0 bg-[#CFB53C] bg-opacity-50 flex justify-center items-center z-50 px-2">
          <div className="bg-white p-4 rounded-lg w-full max-w-md flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-xl">Set Your Location</h2>
              <button onClick={() => setShowLocationPopup(false)}>
                <X size={20} />
              </button>
            </div>

            <input
              type="text"
              placeholder="Type your address"
              value={addressInput}
              onChange={(e) => {
                setAddressInput(e.target.value);
                fetchSuggestions(e.target.value);
              }}
              className="border p-2 rounded w-full text-sm"
            />

            {suggestions.length > 0 && (
              <ul className="border rounded bg-white max-h-48 overflow-y-auto text-sm">
                {suggestions.map((s) => (
                  <li
                    key={s.place_id}
                    className="p-2 cursor-pointer hover:bg-gray-100"
                    onClick={() =>
                      saveLocation(parseFloat(s.lat), parseFloat(s.lon), s.display_name)
                    }
                  >
                    {s.display_name}
                  </li>
                ))}
              </ul>
            )}

            <div className="h-64 w-full mt-2 rounded overflow-hidden">
              <MapContainer
                center={[location.lat, location.lng]}
                zoom={13}
                className="h-full w-full"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <DraggableMarker />
              </MapContainer>
            </div>

            <button
              onClick={() => saveLocation()}
              className="bg-[#CFB53C] p-2 rounded font-bold text-white mt-2 text-sm"
            >
              Save Location
            </button>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="bg-[#FFC533] h-64 sm:h-80 rounded-b-3xl flex flex-col items-center justify-center p-4">
        <div className="relative w-full sm:w-11/12 h-48 sm:h-62 rounded-2xl shadow-md overflow-hidden">
          <img src="/images/banner.jpg" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="mt-6 px-2 sm:px-4 flex gap-4 overflow-x-auto w-full pb-2">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className={`relative flex-shrink-0 cursor-pointer w-40 h-12 sm:h-12 rounded-full overflow-hidden shadow-md ${
              selectedCategory === cat.id ? "ring-2 ring-yellow-400 opacity-90" : "opacity-100"
            } transition-all duration-200 ease-in-out`}
            onClick={() => handleCategoryClick(cat.id)}
          >
            
            <img
              src={cat.image_url || "/images/default-category.png"}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="style-neuton font-bold text-xs sm:text-sm text-black uppercase text-center [text-shadow:_-1px_-1px_0_white,_1px_-1px_0_white,_-1px_1px_0_white,_1px_1px_0_white]">
                {cat.name}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* RESTAURANTS */}
      <div className="mt-4 px-3 sm:px-4 flex flex-col">
        <h2 className="style-neuton text-[25px] sm:text-2xl md:text-[38px] text-black mb-4 mt-1 font-regular">
          Recommended for You
        </h2>

        <div className="space-y-4 pb-24">
          {filteredRestaurants.map((r) => (
            <div
              key={r.id}
              onClick={() => navigate(`/restaurant/${r.id}`)}
              className="bg-white rounded-2xl border border-t-[#FCE8D8] border-[#CFB53C] drop-shadow-[0_6px_2px_#CFB53C] p-3 flex gap-3 w-full cursor-pointer"
            >
              <img
                src={r.image_url || "/images/default-food.png"}
                alt={r.name}
                className="w-28 h-28 sm:w-32 sm:h-32 md:w-76 md:h-36 object-cover rounded-2xl border-b-2 border-[#FFC533] shadow-sm flex-shrink-0"
              />
              <div className="flex flex-col flex-grow">
                <h3 className=" style-neuton font-semibold text-[18px] sm:text-[20px] md:text-[28px] leading-tight">
                  {r.name}
                </h3>
                <p className="style-poppins text-black text-[10px] sm:text-[14px] md:text-[15px] mt-1">
                  Address: {r.address}
                </p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <p className="text-[#FFC533] text-[16px] sm:text-[18px] md:text-[20px] font-medium">
                    {renderStars(r.overall_rating || 0)}
                  </p>
                  <span className="style-poppins bg-[#CFB53C] text-black px-2 py-[1px] rounded-full text-[12px] sm:text-[14px] md:text-[14px]">
                    reviews
                  </span>
                  <p className="style-poppins text-[10px] sm:text-[12px] md:text-[14px] ml-auto">
                    {r.distance.toFixed(2)} km away
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* NAVIGATION */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#CFB53C] rounded-t-lg shadow-md flex justify-around items-center py-3 px-2 safe-area-bottom">
        <button onClick={() => navigate("/homepage")} className="text-[#FFC533]">
          <House size={26} />
        </button>
        <button onClick={() => navigate("/locationpage")}>
          <MapPin size={26} />
        </button>
        <button onClick={() => navigate("/favoritepage")}>
          <Heart size={26} />
        </button>
        <button onClick={() => navigate("/profilepage")}>
          <CircleUserRound size={26} />
        </button>
      </div>
    </div>
  );
}
