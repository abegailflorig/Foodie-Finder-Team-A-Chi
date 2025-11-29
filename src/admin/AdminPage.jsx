import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { Upload, Store, Tags, ChefHat } from "lucide-react";

export default function AdminPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);

  // FORM STATES
  const [restaurantData, setRestaurantData] = useState({
    name: "",
    address: "",
    cuisine: "",
    description: "",
    image: null,
    price_min: "",
    price_max: "",
  });

  const [categoryData, setCategoryData] = useState({
    name: "",
    icon: "",
    image: null,
  });

  const [menuItemData, setMenuItemData] = useState({
    restaurant_id: "",
    category_id: "",
    name: "",
    price: "",
    description: "",
    image: null,
  });

  // Fetch restaurants and categories
  useEffect(() => {
    async function fetchData() {
      const { data: restData } = await supabase.from("restaurants").select("*");
      setRestaurants(restData || []);

      const { data: catData } = await supabase.from("categories").select("*");
      setCategories(catData || []);
    }

    fetchData();
  }, []);

  // Upload image helper
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

  // ===== Add Restaurant =====
  const handleAddRestaurant = async () => {
    if (!restaurantData.name || !restaurantData.price_min || !restaurantData.price_max) {
      alert("Please fill in all required fields");
      return;
    }

    const image_url = await uploadImage("restaurant-images", restaurantData.image);

    const { image, price_min, price_max, ...cleanData } = restaurantData;

    const { error } = await supabase.from("restaurants").insert([
      {
        ...cleanData,
        price_min: Number(price_min),
        price_max: Number(price_max),
        image_url,
      },
    ]);

    if (error) {
      console.error("Failed to add restaurant:", error);
      alert(error.message);
      return;
    }

    setRestaurantData({
      name: "",
      address: "",
      cuisine: "",
      description: "",
      image: null,
      price_min: "",
      price_max: "",
    });

    const { data: restData } = await supabase.from("restaurants").select("*");
    setRestaurants(restData || []);
    alert("Restaurant added successfully!");
  };

  // ===== Add Category =====
  const handleAddCategory = async () => {
    if (!categoryData.name) {
      alert("Please enter category name");
      return;
    }

    const image_url = await uploadImage("category-images", categoryData.image);

    const { error } = await supabase.from("categories").insert([
      {
        name: categoryData.name,
        icon: categoryData.icon || "",
        image_url,
      },
    ]);

    if (error) {
      console.error("Failed to add category:", error);
      alert(error.message);
      return;
    }

    setCategoryData({ name: "", icon: "", image: null });

    const { data: catData } = await supabase.from("categories").select("*");
    setCategories(catData || []);
    alert("Category added successfully!");
  };

  // ===== Add Menu Item =====
  const handleAddMenuItem = async () => {
    if (!menuItemData.restaurant_id || !menuItemData.category_id || !menuItemData.name || !menuItemData.price) {
      alert("Please fill in all required fields");
      return;
    }

    const image_url = await uploadImage("food-images", menuItemData.image);

    const { error } = await supabase.from("menu_items").insert([
      {
        restaurant_id: menuItemData.restaurant_id,
        category_id: menuItemData.category_id,
        name: menuItemData.name,
        price: Number(menuItemData.price),
        description: menuItemData.description,
        image_url,
      },
    ]);

    if (error) {
      console.error("Failed to add menu item:", error);
      alert(error.message);
      return;
    }

    setMenuItemData({
      restaurant_id: "",
      category_id: "",
      name: "",
      price: "",
      description: "",
      image: null,
    });

    alert("Menu item added successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 animate-fadeIn">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-700">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {/* RESTAURANT CARD */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
          <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4 text-gray-700">
            <Store /> Add Restaurant
          </h2>

          <div className="grid grid-cols-1 gap-3">
            <input
              className="input"
              placeholder="Restaurant Name"
              value={restaurantData.name}
              onChange={(e) => setRestaurantData({ ...restaurantData, name: e.target.value })}
            />
            <input
              className="input"
              placeholder="Address"
              value={restaurantData.address}
              onChange={(e) => setRestaurantData({ ...restaurantData, address: e.target.value })}
            />
            <input
              className="input"
              placeholder="Cuisine"
              value={restaurantData.cuisine}
              onChange={(e) => setRestaurantData({ ...restaurantData, cuisine: e.target.value })}
            />
            <textarea
              className="textarea"
              placeholder="Description"
              value={restaurantData.description}
              onChange={(e) => setRestaurantData({ ...restaurantData, description: e.target.value })}
            ></textarea>
            <input
              className="input"
              type="number"
              placeholder="Minimum Price"
              value={restaurantData.price_min}
              onChange={(e) => setRestaurantData({ ...restaurantData, price_min: e.target.value })}
            />
            <input
              className="input"
              type="number"
              placeholder="Maximum Price"
              value={restaurantData.price_max}
              onChange={(e) => setRestaurantData({ ...restaurantData, price_max: e.target.value })}
            />
          </div>

          <div className="mt-4 flex items-center gap-3">
            <Upload className="text-gray-500" />
            <input
              type="file"
              className="file-input"
              onChange={(e) => setRestaurantData({ ...restaurantData, image: e.target.files[0] })}
            />
          </div>

          <button className="btn mt-4 w-full" onClick={handleAddRestaurant}>
            Add Restaurant
          </button>
        </div>

        {/* CATEGORY CARD */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
          <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4 text-gray-700">
            <Tags /> Add Category
          </h2>

          <div className="grid grid-cols-1 gap-3">
            <input
              className="input"
              placeholder="Category Name"
              value={categoryData.name}
              onChange={(e) => setCategoryData({ ...categoryData, name: e.target.value })}
            />
            <input
              className="input"
              placeholder="Icon Name"
              value={categoryData.icon}
              onChange={(e) => setCategoryData({ ...categoryData, icon: e.target.value })}
            />
          </div>

          <div className="mt-4 flex items-center gap-3">
            <Upload className="text-gray-500" />
            <input
              type="file"
              className="file-input"
              onChange={(e) => setCategoryData({ ...categoryData, image: e.target.files[0] })}
            />
          </div>

          <button className="btn mt-4 w-full" onClick={handleAddCategory}>
            Add Category
          </button>
        </div>

        {/* MENU ITEM CARD */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 md:col-span-2">
          <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4 text-gray-700">
            <ChefHat /> Add Food / Menu Item
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              className="input"
              value={menuItemData.restaurant_id}
              onChange={(e) => setMenuItemData({ ...menuItemData, restaurant_id: e.target.value })}
            >
              <option value="">Select Restaurant</option>
              {restaurants.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>

            <select
              className="input"
              value={menuItemData.category_id}
              onChange={(e) => setMenuItemData({ ...menuItemData, category_id: e.target.value })}
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <input
              className="input"
              placeholder="Menu Item Name"
              value={menuItemData.name}
              onChange={(e) => setMenuItemData({ ...menuItemData, name: e.target.value })}
            />
            <input
              className="input"
              placeholder="Price"
              type="number"
              value={menuItemData.price}
              onChange={(e) => setMenuItemData({ ...menuItemData, price: e.target.value })}
            />
          </div>

          <textarea
            className="textarea mt-4"
            placeholder="Description"
            value={menuItemData.description}
            onChange={(e) => setMenuItemData({ ...menuItemData, description: e.target.value })}
          ></textarea>

          <div className="mt-4 flex items-center gap-3">
            <Upload className="text-gray-500" />
            <input
              type="file"
              className="file-input"
              onChange={(e) => setMenuItemData({ ...menuItemData, image: e.target.files[0] })}
            />
          </div>

          <button className="btn w-full mt-4" onClick={handleAddMenuItem}>
            Add Food
          </button>
        </div>
      </div>
    </div>
  );
}
