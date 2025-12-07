import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { Upload, Store, Tags, ChefHat, Menu } from "lucide-react";

export default function AdminPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [menuItemData, setMenuItemData] = useState({
    restaurant_id: "",
    item_name: "",
  });
  const [restaurantData, setRestaurantData] = useState({
    name: "",
    address: "",
    category_id: "",
    image: "",
    image_url: "",
  });
  const [menuOpen, setMenuOpen] = useState(false); // dropdown toggle

  // Load restaurants and categories
  useEffect(() => {
    async function loadData() {
      const { data: restData } = await supabase.from("restaurants").select("*").order("name");
      setRestaurants(restData || []);

      const { data: catData } = await supabase.from("restaurant_categories").select("*").order("name");
      setCategories(catData || []);
    }
    loadData();
  }, []);

  // Upload helper
  async function uploadImage(bucket, file) {
    if (!file) return null;
    const fileName = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from(bucket).upload(fileName, file);
    if (error) {
      console.error("Upload failed:", error);
      alert(error.message);
      return null;
    }
    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return data.publicUrl;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  // Add Restaurant
  const handleAddRestaurant = async () => {
    if (!restaurantData.name || !restaurantData.category_id) {
      return alert("Please fill required fields");
    }

    const payload = {
      name: restaurantData.name,
      address: restaurantData.address,
      category_id: restaurantData.category_id ? Number(restaurantData.category_id) : null,
      image_url: restaurantData.image_url || null,
    };

    const { data: newRestaurant, error } = await supabase.from("restaurants").insert([payload]).select().single();
    if (error) return alert(error.message);

    setRestaurantData({
      name: "", address: "", latitude: "", longitude: "", category_id: "", rating: "", image: null, image_url: "",
    });

    const { data: restData } = await supabase.from("restaurants").select("*").order("name");
    setRestaurants(restData || []);
    alert("Restaurant added successfully!");
  };

  // Add Menu Item
  const handleAddMenuItem = async () => {
    if (!menuItemData.restaurant_id || !menuItemData.item_name) {
      return alert("Fill all menu item fields");
    }

    const { data: menuItem, error } = await supabase.from("restaurant_menus").insert([{
      restaurant_id: menuItemData.restaurant_id,
      item_name: menuItemData.item_name,
    }]).select().single();

    if (error) return alert(error.message);

    setMenuItemData({ restaurant_id: "", item_name: "" });
    alert("Menu item added successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
      {/* Top Right Menu */}
      <div className="absolute top-6 right-6">
        <div className="relative">
          <button className="flex items-center gap-2 border px-4 py-2 rounded-lg bg-white shadow" onClick={() => setMenuOpen(!menuOpen)}>
            <Menu /> Menu
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-50">
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100" onClick={handleLogout}>
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>

      <h1 className="text-4xl font-bold text-center mb-10 text-gray-700">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">

        {/* Add Restaurant */}
        <div className="bg-white rounded-2xl shadow-md p-6 border">
          <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4"><Store /> Add Restaurant</h2>
          <div className="grid gap-3">
            <input className="input" placeholder="Restaurant Name" value={restaurantData.name}
              onChange={(e) => setRestaurantData({ ...restaurantData, name: e.target.value })} />
            <input className="input" placeholder="Address" value={restaurantData.address}
              onChange={(e) => setRestaurantData({ ...restaurantData, address: e.target.value })} />
            <select className="input" value={restaurantData.category_id}
              onChange={(e) => setRestaurantData({ ...restaurantData, category_id: e.target.value })}>
              <option value="">Select Category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input type="file" className="file-input"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const publicUrl = await uploadImage("restaurant-images", file);
                setRestaurantData({ ...restaurantData, image: file, image_url: publicUrl });
              }} />
          </div>
          <button className="btn mt-4 w-full" onClick={handleAddRestaurant}>Add Restaurant</button>
        </div>

        {/* Add Menu Item */}
        <div className="bg-white rounded-2xl shadow-md p-6 border md:col-span-2">
          <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4"><ChefHat /> Add Menu Item</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <select className="input" value={menuItemData.restaurant_id}
              onChange={(e) => setMenuItemData({ ...menuItemData, restaurant_id: e.target.value })}>
              <option value="">Select Restaurant</option>
              {restaurants.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
            <input className="input" placeholder="Menu Item Name" value={menuItemData.item_name}
              onChange={(e) => setMenuItemData({ ...menuItemData, item_name: e.target.value })} />
          </div>
          <button className="btn w-full mt-4" onClick={handleAddMenuItem}>Add Menu Item</button>
        </div>
      </div>
    </div>
  );
}
