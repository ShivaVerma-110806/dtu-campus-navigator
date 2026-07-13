import Settings from "../models/Settings.js";

// Fetch settings configurations (auto-creates default record if empty)
export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Update settings details (Admin-only)
export const updateSettings = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Only admins can update settings" });
    }
    const { appName, logoUrl, defaultLat, defaultLng, theme, googleMapsKey } = req.body;
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }
    settings.appName = appName !== undefined ? appName : settings.appName;
    settings.logoUrl = logoUrl !== undefined ? logoUrl : settings.logoUrl;
    settings.defaultLat = defaultLat !== undefined ? Number(defaultLat) : settings.defaultLat;
    settings.defaultLng = defaultLng !== undefined ? Number(defaultLng) : settings.defaultLng;
    settings.theme = theme !== undefined ? theme : settings.theme;
    settings.googleMapsKey = googleMapsKey !== undefined ? googleMapsKey : settings.googleMapsKey;
    await settings.save();
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
