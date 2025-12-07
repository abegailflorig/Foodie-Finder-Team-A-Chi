import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { House, MapPin, Heart, CircleUserRound, Menu, X } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default Leaflet marker icon
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

  // 📌 Reverse geocoding for PIN location → ADDRESS
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

      if (data?.[0]) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        setLocation({ lat, lng });
      }
    } catch (err) {
      console.error("Autocomplete failed", err);
      setSuggestions([]);
    }
  }

  async function saveLocation(selectedLat, selectedLng, selectedAddress) {
    const lat = selectedLat || location.lat;
    const lng = selectedLng || location.lng;

    // 📌 If address blank → auto-fill from reverse geocode
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

  // 📌 PIN MARKER (updates automatically)
  function DraggableMarker() {
    const [position, setPosition] = useState(location);
    const map = useMap();

    useEffect(() => {
      map.flyTo([location.lat, location.lng], 13, { duration: 1.2 });
      setPosition(location);
    }, [location, map]);

    const eventHandlers = {
      async dragend(e) {
        const latLng = e.target.getLatLng();
        const newPos = { lat: latLng.lat, lng: latLng.lng };

        setPosition(newPos);
        setLocation(newPos);

        // 📌 Auto-correct address input when pin moved
        const addr = await reverseGeocode(newPos.lat, newPos.lng);
        if (addr) setAddressInput(addr);
      },
    };

    return <Marker position={position} draggable={true} eventHandlers={eventHandlers} />;
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
        <div className="fixed inset-0 bg-[#CFB53C] bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg w-11/12 sm:w-1/2 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-xl">Set Your Location</h2>
              <button onClick={() => setShowLocationPopup(false)}>
                <X />
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
              className="border p-2 rounded w-full"
            />

            {suggestions.length > 0 && (
              <ul className="border rounded bg-white max-h-48 overflow-y-auto">
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

            <div className="h-64 w-full mt-2">
              <MapContainer
                center={[location.lat, location.lng]}
                zoom={13}
                className="h-full w-full rounded"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <DraggableMarker />
              </MapContainer>
            </div>

            <button
              onClick={() => saveLocation()}
              className="bg-[#CFB53C] p-2 rounded font-bold text-white mt-2"
            >
              Save Location
            </button>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="bg-[#FFC533] h-64 sm:h-80 rounded-b-3xl flex flex-col items-center justify-center p-4">
        <div className="relative w-11/12 sm:w-10/12 h-48 sm:h-62 rounded-2xl shadow-md overflow-hidden">
          <img src="/images/banner.jpg" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="mt-6 px-4 flex gap-4 overflow-x-auto w-full">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className={`flex flex-col items-center flex-shrink-0 cursor-pointer ${
              selectedCategory === cat.id ? "opacity-80" : "opacity-100"
            }`}
            onClick={() => handleCategoryClick(cat.id)}
          >
            <div
              className={`rounded-lg border-b-4 ${
                selectedCategory === cat.id
                  ? "border-[#FFC533] scale-105"
                  : "border-[#FFC533]"
              } transition-all`}
            >
              <img
                src={cat.image_url || "/images/default-category.png"}
                className="w-18 h-18 sm:w-24 sm:h-20 object-cover rounded-lg"
              />
            </div>
            <p className="text-xs sm:text-sm mt-1 text-center">{cat.name}</p>
          </div>
        ))}
      </div>

      {/* RESTAURANTS */}
      <div className="mt-4 px-4 flex flex-col">
        <h2 className="text-xl sm:text-[32px] text-black mb-2 mt-1">Restaurants</h2>

        <div className="grid grid-cols-2 gap-3 pb-24 cursor-pointer">
          {filteredRestaurants.map((r) => (
            <div
              key={r.id}
              onClick={() => navigate(`/restaurant/${r.id}`)}
              className="bg-[#FFFAE2] border border-[#FCE8D8] rounded-2xl shadow-md p-3"
            >
              <img
                src={r.image_url || "/images/default-food.png"}
                className="w-full h-40 object-cover rounded-lg"
              />
              <p className="font-bold text-[22px] mt-2">{r.name}</p>
              <p className="text-[14px] text-gray-600">{r.address}</p>
              <p className="text-xs text-gray-500 mt-1">
                {r.distance.toFixed(2)} km away
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* NAVIGATION */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border border-[#CFB53C] rounded-t-lg shadow-md flex justify-around items-center py-3">
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
