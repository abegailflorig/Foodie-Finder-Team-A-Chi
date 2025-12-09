import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { Upload, Store, ChefHat, Menu } from "lucide-react";

const LOCATIONIQ_KEY = "pk.1526e4b7f7d13fc301eec3ef3492c130";

export default function AdminPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [restaurantData, setRestaurantData] = useState({
    name: "",
    address: "",
    category_id: "",
    image: null,
    image_url: "",
  });
  const [menuItemData, setMenuItemData] = useState({
    restaurant_ids: [],
    items: [""],
  });
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      const { data: restData } = await supabase.from("restaurants").select("*").order("name");
      setRestaurants(restData || []);
      const { data: catData } = await supabase.from("restaurant_categories").select("*").order("name");
      setCategories(catData || []);
    }
    loadData();
  }, []);

  const uploadImage = async (bucket, file) => {
    if (!file) return null;
    const fileName = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from(bucket).upload(fileName, file);
    if (error) return alert(error.message);
    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return data.publicUrl;
  };

  const geocodeAddress = async (address) => {
    if (!address) return null;
    try {
      const res = await fetch(
        `https://us1.locationiq.com/v1/search.php?key=${LOCATIONIQ_KEY}&q=${encodeURIComponent(address)}&format=json`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        return {
          latitude: data[0].lat,
          longitude: data[0].lon,
          display_name: data[0].display_name,
        };
      }
    } catch (err) {
      console.error(err);
    }
    return null;
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const handleAddRestaurant = async () => {
    if (!restaurantData.name || !restaurantData.category_id || !restaurantData.address) return alert("Please fill required fields");

    const geo = await geocodeAddress(restaurantData.address);
    if (!geo) return alert("Could not geocode the address.");

    const payload = {
      name: restaurantData.name,
      address: geo.display_name,
      latitude: geo.latitude,
      longitude: geo.longitude,
      category_id: Number(restaurantData.category_id),
      image_url: restaurantData.image_url || null,
    };

    const { error } = await supabase.from("restaurants").insert([payload]);
    if (error) return alert(error.message);

    setRestaurantData({ name: "", address: "", category_id: "", image: null, image_url: "" });
    const { data: restData } = await supabase.from("restaurants").select("*").order("name");
    setRestaurants(restData || []);
    alert("Restaurant added successfully!");
  };

  const handleAddMenuItems = async () => {
    if (!menuItemData.restaurant_ids.length || !menuItemData.items.some(i => i.trim() !== "")) return alert("Select restaurants and add at least one menu item");

    const payload = [];
    menuItemData.restaurant_ids.forEach(rid => {
      menuItemData.items.forEach(name => {
        if (name.trim()) payload.push({ restaurant_id: rid, item_name: name.trim() });
      });
    });

    const { error } = await supabase.from("restaurant_menus").insert(payload);
    if (error) return alert(error.message);

    setMenuItemData({ restaurant_ids: [], items: [""] });
    alert("Menu items added successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Top Right Menu */}
      <div className="flex justify-end mb-6 relative">
        <button
          className="flex items-center gap-2 border px-4 py-2 rounded-lg bg-[#FFC533] text-white shadow hover:brightness-90 transition"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu /> Menu
        </button>
        {menuOpen && (
          <div className="absolute right-10 mt-15 w-25 bg-white border rounded-lg shadow-lg z-50">
            <button
              className="w-full text-left px-4 py-1 hover:bg-gray-100"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>
        )}
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-700">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">

        {/* Add Restaurant */}
        <div className="bg-[#FFFAE2] border border-[#CFB53C] rounded-2xl shadow-md p-6 flex flex-col">
          <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4"><Store /> Add Restaurant</h2>
          <div className="flex flex-col gap-3">
            <input
              className="w-full border border-[#CFB53C] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFC533]"
              placeholder="Restaurant Name"
              value={restaurantData.name}
              onChange={(e) => setRestaurantData({ ...restaurantData, name: e.target.value })}
            />
            <input
              className="w-full border border-[#CFB53C] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFC533]"
              placeholder="Address"
              value={restaurantData.address}
              onChange={(e) => setRestaurantData({ ...restaurantData, address: e.target.value })}
            />
            <select
              className="w-full border border-[#CFB53C] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFC533]"
              value={restaurantData.category_id}
              onChange={(e) => setRestaurantData({ ...restaurantData, category_id: e.target.value })}
            >
              <option value="">Select Category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input
              type="file"
              className="border border-[#CFB53C] rounded px-3 py-2"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const publicUrl = await uploadImage("restaurant-images", file);
                setRestaurantData({ ...restaurantData, image: file, image_url: publicUrl });
              }}
            />
          </div>
          <button
            className="mt-4 w-full bg-[#FFC533] text-white py-2 rounded-lg hover:brightness-90 transition"
            onClick={handleAddRestaurant}
          >
            Add Restaurant
          </button>
        </div>

        {/* Add Menu Items */}
        <div className="bg-[#FFFAE2] border border-[#CFB53C] rounded-2xl shadow-md p-6 md:col-span-2 flex flex-col">
          <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4"><ChefHat /> Add Menu Items</h2>

          {/* Restaurants checkboxes */}
          <div className="mb-4">
            <label className="font-semibold mb-2 block">Select Restaurants:</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border border-[#CFB53C] p-2 rounded">
              {restaurants.map(r => (
                <label key={r.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={r.id}
                    checked={menuItemData.restaurant_ids.includes(r.id)}
                    onChange={(e) => {
                      const id = r.id;
                      let newSelected = [...menuItemData.restaurant_ids];
                      if (e.target.checked) newSelected.push(id);
                      else newSelected = newSelected.filter(i => i !== id);
                      setMenuItemData({ ...menuItemData, restaurant_ids: newSelected });
                    }}
                    className="accent-[#FFC533]"
                  />
                  {r.name}
                </label>
              ))}
            </div>
          </div>

          {/* Menu Item Inputs */}
          {menuItemData.items.map((item, index) => (
            <div key={index} className="flex flex-col sm:flex-row gap-2 mb-2">
              <input
                className="flex-1 border border-[#CFB53C] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFC533]"
                placeholder="Menu Item Name"
                value={item}
                onChange={(e) => {
                  const newItems = [...menuItemData.items];
                  newItems[index] = e.target.value;
                  setMenuItemData({ ...menuItemData, items: newItems });
                }}
              />
              <button
                type="button"
                className="bg-[#FFC533] text-white py-2 px-4 rounded hover:brightness-90 transition"
                onClick={() => {
                  const newItems = menuItemData.items.filter((_, i) => i !== index);
                  setMenuItemData({ ...menuItemData, items: newItems });
                }}
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            className="mb-4 bg-[#FFC533] text-white py-2 rounded hover:brightness-90 transition"
            onClick={() => setMenuItemData({ ...menuItemData, items: [...menuItemData.items, ""] })}
          >
            + Add Another Menu Item
          </button>

          <button
            className="w-full bg-[#FFC533] text-white py-2 rounded-lg hover:brightness-90 transition"
            onClick={handleAddMenuItems}
          >
            Add Menu Items
          </button>
        </div>
      </div>
    </div>
  );
}
