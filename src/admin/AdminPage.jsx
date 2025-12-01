import React, { useState, useEffect } from "react"; 
import { supabase } from "../lib/supabaseClient";
import { Upload, Store, Tags, ChefHat } from "lucide-react";

export default function AdminPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [meals, setMeals] = useState([]);

  const [restaurantData, setRestaurantData] = useState({
    name: "",
    address: "",
    cuisine: "",
    description: "",
    image: null,
    image_url: "",
    price_min: "",
    price_max: "",
    latitude: "",   // added
    longitude: "",  // added
  });

  const [recommendationData, setRecommendationData] = useState({
    name: "",
    image: null,
    image_url: "",
  });

  const [menuItemData, setMenuItemData] = useState({
    restaurant_id: "",
    recommendation_ids: [],
    meal_ids: [],
    name: "",
    price: "",
    description: "",
    image: null,
    image_url: "",
  });

  // Load restaurants, recommendations, and meals
  useEffect(() => {
    async function loadData() {
      const { data: restData } = await supabase.from("restaurants").select("*").order("name");
      setRestaurants(restData || []);

      const { data: recData } = await supabase.from("recommendation").select("*").order("name");
      setRecommendations(recData || []);

      const { data: mealData } = await supabase.from("meals").select("*").order("name");
      setMeals(mealData || []);
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

  // Add restaurant
  const handleAddRestaurant = async () => {
    if (!restaurantData.name || !restaurantData.price_min || !restaurantData.price_max) {
      alert("Please fill required restaurant fields.");
      return;
    }
    const payload = {
      name: restaurantData.name,
      address: restaurantData.address,
      cuisine: restaurantData.cuisine,
      description: restaurantData.description,
      price_min: Number(restaurantData.price_min),
      price_max: Number(restaurantData.price_max),
      image_url: restaurantData.image_url || null,
      latitude: restaurantData.latitude ? Number(restaurantData.latitude) : null,
      longitude: restaurantData.longitude ? Number(restaurantData.longitude) : null,
    };
    const { error } = await supabase.from("restaurants").insert([payload]);
    if (error) return alert(error.message);

    setRestaurantData({
      name: "", address: "", cuisine: "", description: "",
      image: null, image_url: "", price_min: "", price_max: "", latitude: "", longitude: ""
    });

    const { data: restData } = await supabase.from("restaurants").select("*").order("name");
    setRestaurants(restData || []);
    alert("Restaurant added");
  };

  // Add recommendation
  const handleAddRecommendation = async () => {
    if (!recommendationData.name) return alert("Recommendation name required");
    const { error } = await supabase.from("recommendation").insert([{ name: recommendationData.name, image_url: recommendationData.image_url }]);
    if (error) return alert(error.message);

    setRecommendationData({ name: "", image: null, image_url: "" });
    const { data: recData } = await supabase.from("recommendation").select("*").order("name");
    setRecommendations(recData || []);
    alert("Recommendation added");
  };

  // Add menu item with multiple recommendations and meals
  const handleAddMenuItem = async () => {
    if (!menuItemData.restaurant_id || !menuItemData.recommendation_ids.length || !menuItemData.meal_ids.length || !menuItemData.name || !menuItemData.price) {
      return alert("Fill all menu item fields");
    }

    // Insert menu item first
    const { data: menuItem, error } = await supabase.from("menu_items").insert([{
      restaurant_id: menuItemData.restaurant_id,
      name: menuItemData.name,
      price: Number(menuItemData.price),
      description: menuItemData.description,
      image_url: menuItemData.image_url || null
    }]).select().single();

    if (error) return alert(error.message);

    // Insert into menu_item_recommendations (many-to-many)
    if (menuItemData.recommendation_ids.length) {
      const recPayload = menuItemData.recommendation_ids.map(id => ({ menu_item_id: menuItem.id, recommendation_id: id }));
      const { error: recError } = await supabase.from("menu_item_recommendations").insert(recPayload);
      if (recError) console.error(recError);
    }

    // Insert into menu_item_meals (many-to-many)
    if (menuItemData.meal_ids.length) {
      const mealPayload = menuItemData.meal_ids.map(id => ({ menu_item_id: menuItem.id, meal_id: id }));
      const { error: mealError } = await supabase.from("menu_item_meals").insert(mealPayload);
      if (mealError) console.error(mealError);
    }

    setMenuItemData({ restaurant_id: "", recommendation_ids: [], meal_ids: [], name: "", price: "", description: "", image: null, image_url: "" });
    alert("Menu item added with multiple recommendations and meals!");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
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
            <input className="input" placeholder="Cuisine" value={restaurantData.cuisine}
              onChange={(e) => setRestaurantData({ ...restaurantData, cuisine: e.target.value })} />
            <textarea className="textarea" placeholder="Description" value={restaurantData.description}
              onChange={(e) => setRestaurantData({ ...restaurantData, description: e.target.value })} />
            <div className="flex gap-2">
              <input className="input" type="number" placeholder="Min Price" value={restaurantData.price_min}
                onChange={(e) => setRestaurantData({ ...restaurantData, price_min: e.target.value })} />
              <input className="input" type="number" placeholder="Max Price" value={restaurantData.price_max}
                onChange={(e) => setRestaurantData({ ...restaurantData, price_max: e.target.value })} />
            </div>

            {/* Latitude / Longitude */}
            <div className="flex gap-2">
              <input className="input" type="number" step="0.000001" placeholder="Latitude" value={restaurantData.latitude}
                onChange={(e) => setRestaurantData({ ...restaurantData, latitude: e.target.value })} />
              <input className="input" type="number" step="0.000001" placeholder="Longitude" value={restaurantData.longitude}
                onChange={(e) => setRestaurantData({ ...restaurantData, longitude: e.target.value })} />
            </div>

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

        {/* Add Recommendation */}
        <div className="bg-white rounded-2xl shadow-md p-6 border">
          <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4"><Tags /> Add Recommendation</h2>
          <input className="input" placeholder="Recommendation Name" value={recommendationData.name}
            onChange={(e) => setRecommendationData({ ...recommendationData, name: e.target.value })} />
          <input type="file" className="file-input mt-3"
            onChange={async (e) => {
              const file = e.target.files[0];
              if (!file) return;
              const publicUrl = await uploadImage("recommendation-images", file);
              setRecommendationData({ ...recommendationData, image: file, image_url: publicUrl });
            }} />
          <button className="btn mt-4 w-full" onClick={handleAddRecommendation}>Add Recommendation</button>
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

            {/* Recommendations circle choices */}
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
              {recommendations.map((r) => {
                const selected = menuItemData.recommendation_ids.includes(r.id);
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => {
                      if (selected) {
                        setMenuItemData({ ...menuItemData, recommendation_ids: menuItemData.recommendation_ids.filter(id => id !== r.id) });
                      } else {
                        setMenuItemData({ ...menuItemData, recommendation_ids: [...menuItemData.recommendation_ids, r.id] });
                      }
                    }}
                    className={`px-3 py-1 rounded-full border ${selected ? "bg-yellow-400 text-white" : "bg-gray-200 text-gray-700"}`}
                  >
                    {r.name}
                  </button>
                );
              })}
            </div>

            {/* Meals circle choices */}
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
              {meals.map((m) => {
                const selected = menuItemData.meal_ids.includes(m.id);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      if (selected) {
                        setMenuItemData({ ...menuItemData, meal_ids: menuItemData.meal_ids.filter(id => id !== m.id) });
                      } else {
                        setMenuItemData({ ...menuItemData, meal_ids: [...menuItemData.meal_ids, m.id] });
                      }
                    }}
                    className={`px-3 py-1 rounded-full border ${selected ? "bg-green-400 text-white" : "bg-gray-200 text-gray-700"}`}
                  >
                    {m.name}
                  </button>
                );
              })}
            </div>

            <input className="input" placeholder="Food Name" value={menuItemData.name}
              onChange={(e) => setMenuItemData({ ...menuItemData, name: e.target.value })} />
            <input className="input" type="number" placeholder="Price" value={menuItemData.price}
              onChange={(e) => setMenuItemData({ ...menuItemData, price: e.target.value })} />
          </div>
          <textarea className="textarea mt-4" placeholder="Description" value={menuItemData.description}
            onChange={(e) => setMenuItemData({ ...menuItemData, description: e.target.value })} />
          <input type="file" className="file-input mt-4"
            onChange={async (e) => {
              const file = e.target.files[0];
              if (!file) return;
              const publicUrl = await uploadImage("food-images", file);
              setMenuItemData({ ...menuItemData, image: file, image_url: publicUrl });
            }} />
          <button className="btn w-full mt-4" onClick={handleAddMenuItem}>Add Menu Item</button>
        </div>

      </div>
    </div>
  );
}
