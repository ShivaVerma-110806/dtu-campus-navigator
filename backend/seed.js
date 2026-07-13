import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import Users from "./models/Users.js";
import Locations from "./models/Locations.js";

dotenv.config();

const SEED_LOCATIONS = [
  {
    name: "Sports Complex",
    description: "Indoor courts for badminton, table tennis and squash. Outdoor grounds for cricket, football and athletics.",
    category: "Sports",
    building: "SC Block",
    floor: "Ground - 2",
    roomNumber: "Indoor Arena",
    location: {
      type: "Point",
      coordinates: [77.1160, 28.7505] // DTU Sports Complex [lng, lat]
    },
    images: ["https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&auto=format&fit=crop&q=80"],
    popular: true,
    isActive: true
  },
  {
    name: "Central Library",
    description: "Main library with three floors of reading space, digital library access, reference section, and vast academic catalog.",
    category: "Library",
    building: "Library Block",
    floor: "1st - 3rd Floor",
    roomNumber: "Main Hall",
    location: {
      type: "Point",
      coordinates: [77.1172, 28.7498] // DTU Library [lng, lat]
    },
    images: ["https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&auto=format&fit=crop&q=80"],
    popular: true,
    isActive: true
  },
  {
    name: "Mech Canteen",
    description: "Popular student dining spot offering quick snacks, meals, tea, and coffee in a vibrant campus social hub.",
    category: "Food",
    building: "Mechanical Block",
    floor: "Ground",
    roomNumber: "Canteen Area",
    location: {
      type: "Point",
      coordinates: [77.1165, 28.7501] // DTU Mech Canteen [lng, lat]
    },
    images: ["https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80"],
    popular: false,
    isActive: true
  },
  {
    name: "Vishwakarma Hostel",
    description: "Spacious residential hostel housing undergraduate students with study rooms, a mess, and recreation facilities.",
    category: "Hostel",
    building: "Hostel Block A",
    floor: "Ground - 4th Floor",
    roomNumber: "Rooms 1-120",
    location: {
      type: "Point",
      coordinates: [77.1190, 28.7485] // DTU Hostel A [lng, lat]
    },
    images: ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&auto=format&fit=crop&q=80"],
    popular: false,
    isActive: true
  },
  {
    name: "Arogya Dham (Medical Centre)",
    description: "DTU's primary health centre offering medical assistance, first aid, routine checkups, and 24/7 emergency response support.",
    category: "Medical",
    building: "Health Centre",
    floor: "Ground",
    roomNumber: "OPD 1 & 2",
    location: {
      type: "Point",
      coordinates: [77.1155, 28.7510] // DTU Health Centre [lng, lat]
    },
    images: ["https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&auto=format&fit=crop&q=80"],
    popular: false,
    isActive: true
  },
  {
    name: "Administration Office",
    description: "The administrative core hosting offices for student services, registration, academic affairs, accounts, and leadership.",
    category: "Administration",
    building: "Admin Block",
    floor: "1st & 2nd Floor",
    roomNumber: "VC Cabin & Office",
    location: {
      type: "Point",
      coordinates: [77.1175, 28.7508] // DTU Admin Block [lng, lat]
    },
    images: ["https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&auto=format&fit=crop&q=80"],
    popular: true,
    isActive: true
  },
  {
    name: "SPS Cafeteria",
    description: "Modern cafeteria offering multi-cuisine fast food, fresh juices, shakes, and tea/coffee, extremely popular during class breaks.",
    category: "Food",
    building: "SPS Block",
    floor: "Ground",
    roomNumber: "Cafeteria",
    location: {
      type: "Point",
      coordinates: [77.1150, 28.7492] // DTU SPS Block [lng, lat]
    },
    images: ["https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=600&auto=format&fit=crop&q=80"],
    popular: false,
    isActive: true
  },
  {
    name: "DTU Main Entrance Gate",
    description: "Central entry and exit point of DTU campus, serving as transit pick-up/drop-off for buses, auto-rickshaws, and e-rickshaws.",
    category: "Transport",
    building: "Entry Plaza",
    floor: "Outdoors",
    roomNumber: "Main Gate",
    location: {
      type: "Point",
      coordinates: [77.1182, 28.7475] // DTU Main Gate [lng, lat]
    },
    images: ["https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80"],
    popular: true,
    isActive: true
  }
];

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB...");

  // 1. Seed Admin User
  const adminEmail = "admin@dtu.ac.in";
  const existingAdmin = await Users.findOne({ email: adminEmail });
  
  let adminId;
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("adminpassword", 10);
    const newAdmin = await Users.create({
      name: "DTU Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
      isVerified: true
    });
    adminId = newAdmin._id;
    console.log("Admin user created: admin@dtu.ac.in / adminpassword");
  } else {
    adminId = existingAdmin._id;
    console.log("Admin user already exists.");
  }

  // 2. Seed Locations
  await Locations.deleteMany({});
  console.log("Deleted old locations.");

  for (const loc of SEED_LOCATIONS) {
    const slug = loc.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    await Locations.create({
      ...loc,
      slug,
      createdBy: adminId
    });
  }

  console.log(`Successfully seeded ${SEED_LOCATIONS.length} locations.`);
  await mongoose.disconnect();
};

seed().catch(console.error);
