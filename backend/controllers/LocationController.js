import generateSlug from "../middleware/Slugify.js";
import Locations from "../models/Locations.js";

export const createLocation = async (req, res) => {
  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can create locations.",
      });
    }

    const {
      name,
      description,
      address,
      coordinates,
      category,
      building,
      floor,
      roomNumber,
      keywords,
      images,
      status,
    } = req.body;

    if (
      !name ||
      !category ||
      !coordinates ||
      !coordinates.latitude ||
      !coordinates.longitude
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing.",
      });
    }

    const slug = generateSlug(name);

    const existingLocation = await Locations.findOne({ slug });

    if (existingLocation) {
      return res.status(400).json({
        success: false,
        message: "Location already exists.",
      });
    }

    const parsedKeywords = Array.isArray(keywords)
      ? keywords
      : typeof keywords === "string"
      ? keywords.split(",").map((k) => k.trim())
      : [];

    const location = await Locations.create({
      name,
      description,
      address,
      slug,
      location: {
        type: "Point",
        coordinates: [Number(coordinates.longitude), Number(coordinates.latitude)],
      },
      category,
      building,
      floor,
      roomNumber,
      keywords: parsedKeywords,
      images,
      status: status || "Published",
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Location created successfully.",
      location,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};
export const updateLocation = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Only admins can update locations.",
    });
  }

  try {
    const { id } = req.params;
    const {
      name,
      description,
      address,
      coordinates,
      category,
      building,
      floor,
      roomNumber,
      keywords,
      images,
      status,
    } = req.body;

    const location = await Locations.findById(id);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found.",
      });
    }

    location.name = name || location.name;
    location.description = description || location.description;
    location.address = address || location.address;
    location.category = category || location.category;
    location.building = building || location.building;
    location.floor = floor || location.floor;
    location.roomNumber = roomNumber !== undefined ? roomNumber : location.roomNumber;
    location.images = images || location.images;
    location.status = status || location.status;

    if (keywords !== undefined) {
      location.keywords = Array.isArray(keywords)
        ? keywords
        : typeof keywords === "string"
        ? keywords.split(",").map((k) => k.trim())
        : [];
    }

    if (coordinates && coordinates.latitude && coordinates.longitude) {
      location.location = {
        type: "Point",
        coordinates: [Number(coordinates.longitude), Number(coordinates.latitude)],
      };
    }

    await location.save();

    res.status(200).json({
      success: true,
      message: "Location updated successfully.",
      location,
    });
  } catch (error) {
    console.error("Update Location Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
export const deleteLocation = async (req, res) => {
  if(req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Only admins can delete locations.",
    });
  }

  try {
    const { id } = req.params;

    const location = await Locations.findByIdAndDelete(id);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Location deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
export const getAllLocations = async (req, res) => {
  try {
    const locations = await Locations.find();
    res.status(200).json({
      success: true,
      message: "Locations retrieved successfully.",
      data: locations,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
export const searchLocations = async (req, res) => {
    try {
      const { query } = req.query;
  
      // Validate query
      if (!query || query.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "Search query is required.",
        });
      }
  
      const searchQuery = query.trim();
  
      const locations = await Locations.find({
        $or: [
          { name: { $regex: searchQuery, $options: "i" } },
          { building: { $regex: searchQuery, $options: "i" } },
          { roomNumber: { $regex: searchQuery, $options: "i" } },
          { description: { $regex: searchQuery, $options: "i" } },
          { keywords: { $in: [new RegExp(searchQuery, "i")] } },
        ],
      }).select(
        "name slug category building floor roomNumber location images"
      );
  
      if (locations.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No locations found.",
        });
      }
  
      const result = locations.map((location) => ({
        id: location._id,
        name: location.name,
        slug: location.slug,
        category: location.category,
        building: location.building,
        floor: location.floor,
        roomNumber: location.roomNumber,
        coordinates: location.coordinates,
        image: location.images?.[0] || null, // First image as thumbnail
      }));
  
      res.status(200).json({
        success: true,
        message: "Locations retrieved successfully.",
        count: result.length,
        data: result,
      });
    } catch (error) {
      console.error("Search Error:", error);
  
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };
export const getLocationBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const location = await Locations.findOne({ slug });

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Location retrieved successfully.",
      data: location,
    });
  } catch (error) {
    console.error("Get Location Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};