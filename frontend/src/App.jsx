import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "./components/campus/Navbar";
import SearchPanel from "./components/campus/SearchPanel";
import MapContainer from "./components/campus/MapContainer";
import LocationDrawer from "./components/campus/LocationDrawer";
import MobileSearchSheet from "./components/campus/MobileSearchSheet";
import LoginPage from "./components/campus/LoginPage";
import RegisterPage from "./components/campus/RegisterPage";
import AdminDashboard from "./components/campus/AdminDashboard";

import { getAllLocations, getSettings } from "./services/locationService";
import { logoutUser } from "./services/authService";
import { useMobile } from "./hooks/use-mobile";
import { Search, Loader2 } from "lucide-react";

export default function App() {
  const isMobile = useMobile(1024); // Breakpoint for desktop sidebar

  // Navigation state: 'map', 'login', 'register', 'admin'
  const [currentPage, setCurrentPage] = useState("map");

  // Authentication State
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Reactive Navigator States
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(null); // Category ID
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // 1. Fetch locations using TanStack Query (React Query)
  const {
    data: locationsData,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ["locations"],
    queryFn: getAllLocations
  });

  const locations = locationsData?.data || [];

  // Fetch settings dynamically from MongoDB
  const { data: settingsData } = useQuery({
    queryKey: ["settings"],
    queryFn: getSettings
  });
  const settings = settingsData?.data || {};
  const appName = settings.appName || "FindMyWay";
  const defaultCenter = settings.defaultLat && settings.defaultLng ? {
    lat: settings.defaultLat,
    lng: settings.defaultLng
  } : null;
  const googleMapsKey = settings.googleMapsKey || "";

  // 2. Filter locations for the map/sidebar display based on query and activeCategory
  const filteredLocations = useMemo(() => {
    let result = locations;

    if (activeCategory) {
      // Find Category backend enum values
      const activeCat = activeCategory.toLowerCase();
      // Mapped labels in UI
      const categoryMap = {
        study: ["Academic", "Library"],
        hostels: ["Hostel"],
        food: ["Food"],
        sports: ["Sports"],
        medical: ["Medical"],
        transport: ["Transport"],
        admin: ["Administration"]
      };

      const backendVals = categoryMap[activeCat] || [];
      result = result.filter((loc) => backendVals.includes(loc.category));
    }

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (loc) =>
          loc.name?.toLowerCase().includes(query) ||
          loc.building?.toLowerCase().includes(query) ||
          loc.category?.toLowerCase().includes(query) ||
          (loc.keywords && loc.keywords.some((k) => k.toLowerCase().includes(query)))
      );
    }

    return result;
  }, [locations, activeCategory, searchQuery]);

  // Handle Location Selection
  const handleSelectLocation = (loc) => {
    setSelectedLocation(loc);
    if (loc) {
      setSearchQuery(loc.name);
    }
  };

  // Toggle Category selection
  const handleToggleCategory = (catId) => {
    setActiveCategory(catId);
    setSelectedLocation(null);
  };

  // User Actions
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setCurrentPage("map");
  };

  const handleRegisterSuccess = (userData) => {
    setUser(userData);
    setCurrentPage("map");
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.warn("Logout request failed in backend, clearing locally anyway.");
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setCurrentPage("map");
  };

  const handleNavigate = (page) => {
    if (page === "admin" && user?.role !== "admin") {
      setCurrentPage("map");
      return;
    }
    setCurrentPage(page);
    setSelectedLocation(null); // Clear selected drawer
  };

  return (
    <div className="w-full h-screen flex flex-col bg-background text-foreground font-sans overflow-hidden">
      {/* Navbar shows profiles / sign in option */}
      <Navbar
        user={user}
        appName={appName}
        onOpenSearch={() => setMobileSearchOpen(true)}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />

      {/* Pages Switch Router */}
      <div className="flex-1 flex min-h-0 relative">
        {currentPage === "map" && (
          <>
            {/* Loading/Error/Empty States management */}
            {isLoading ? (
              <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex flex-col items-center justify-center z-50">
                <Loader2 className="animate-spin text-primary" size={36} />
                <p className="text-[14px] text-muted-foreground mt-2 font-medium">
                  Loading campus map...
                </p>
              </div>
            ) : isError ? (
              <div className="absolute inset-0 bg-white flex flex-col items-center justify-center p-6 z-50">
                <div className="p-4 border border-red-200 bg-red-50 text-red-700 rounded-2xl max-w-md text-center text-[14px] space-y-2">
                  <h3 className="font-semibold text-[15px]">Failed to Load Map Navigator</h3>
                  <p>{error?.message || "Verify your connection to the local database backend on port 5000."}</p>
                </div>
              </div>
            ) : (
              <>
                {/* Desktop Sidebar (Only visible ≥ 1024px) */}
                {!isMobile && (
                  <SearchPanel
                    locations={locations}
                    selectedLocationId={selectedLocation?._id || null}
                    onSelectLocation={handleSelectLocation}
                    activeCategory={activeCategory}
                    onToggleCategory={handleToggleCategory}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                  />
                )}

                {/* Map Viewport Area */}
                <section className="flex-1 min-h-0 h-full relative">
                  <MapContainer
                    locations={filteredLocations}
                    selectedId={selectedLocation?._id || null}
                    onSelect={handleSelectLocation}
                    activeCategory={activeCategory}
                    googleMapsKey={googleMapsKey}
                    defaultCenter={defaultCenter}
                  />

                  {/* Floating Search Pill for Mobile viewport context overlay */}
                  {isMobile && (
                    <div className="absolute top-3 left-4 right-4 z-20 pointer-events-none">
                      <button
                        onClick={() => setMobileSearchOpen(true)}
                        className="w-full h-12 bg-white rounded-full border border-border shadow-md px-4 flex items-center gap-3 text-muted-foreground text-[14px] text-left hover:bg-muted/80 transition-shadow duration-150 pointer-events-auto cursor-pointer"
                      >
                        <Search size={20} className="shrink-0" />
                        <span className="truncate">Search buildings, classrooms...</span>
                      </button>
                    </div>
                  )}

                  {/* Location details card drawer */}
                  {selectedLocation && (
                    <LocationDrawer
                      location={selectedLocation}
                      onClose={() => setSelectedLocation(null)}
                      isMobile={isMobile}
                    />
                  )}
                </section>

                {/* Mobile Full-Screen Search overlay */}
                {isMobile && (
                  <MobileSearchSheet
                    isOpen={mobileSearchOpen}
                    onClose={() => setMobileSearchOpen(false)}
                    locations={locations}
                    onSelectLocation={handleSelectLocation}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    activeCategory={activeCategory}
                    onToggleCategory={handleToggleCategory}
                  />
                )}
              </>
            )}
          </>
        )}

        {currentPage === "login" && (
          <LoginPage onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigate} />
        )}

        {currentPage === "register" && (
          <RegisterPage onRegisterSuccess={handleRegisterSuccess} onNavigate={handleNavigate} />
        )}

        {currentPage === "admin" && (
          <AdminDashboard
            user={user}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
            onViewOnMap={(loc) => {
              handleSelectLocation(loc);
              setCurrentPage("map");
            }}
          />
        )}
      </div>
    </div>
  );
}
