import Category from "../models/Category.js";

// Get all categories (with seed logic)
export const getAllCategories = async (req, res) => {
  try {
    let categories = await Category.find();
    if (categories.length === 0) {
      const defaults = [
        { name: "Academic", iconName: "BookOpen" },
        { name: "Hostel", iconName: "Home" },
        { name: "Food", iconName: "Coffee" },
        { name: "Library", iconName: "Book" },
        { name: "Sports", iconName: "Trophy" },
        { name: "Medical", iconName: "HeartPulse" },
        { name: "Parking", iconName: "SquarePark" },
        { name: "Administration", iconName: "ShieldAlert" },
        { name: "Transport", iconName: "Bus" },
        { name: "Auditorium", iconName: "Projector" },
        { name: "Other", iconName: "MapPin" }
      ];
      await Category.insertMany(defaults);
      categories = await Category.find();
    }
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Create a category
export const createCategory = async (req, res) => {
  try {
    const { name, iconName, iconUrl } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }
    const exists = await Category.findOne({ name });
    if (exists) {
      return res.status(400).json({ success: false, message: "Category already exists" });
    }
    const newCat = await Category.create({ name, iconName, iconUrl });
    res.status(201).json({ success: true, data: newCat });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Update a category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, iconName, iconUrl } = req.body;
    const cat = await Category.findById(id);
    if (!cat) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    cat.name = name || cat.name;
    cat.iconName = iconName || cat.iconName;
    cat.iconUrl = iconUrl !== undefined ? iconUrl : cat.iconUrl;
    await cat.save();
    res.status(200).json({ success: true, data: cat });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Delete a category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const cat = await Category.findByIdAndDelete(id);
    if (!cat) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    res.status(200).json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
