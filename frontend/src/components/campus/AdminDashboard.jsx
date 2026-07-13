import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllLocations,
  createLocation,
  updateLocation,
  deleteLocation,
  getAllCategories,
  getSettings,
  getAllMedia
} from "../../services/locationService";
import { getAllUsers } from "../../services/authService";

// Sidebar Lucide Icons
import {
  LayoutDashboard,
  MapPin,
  PlusCircle,
  Edit,
  FolderOpen,
  Image as ImageIcon,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ArrowLeft,
  Loader2
} from "lucide-react";
import { cn } from "../../lib/utils";

// Sub-Tab Components
import DashboardTab from "./tabs/DashboardTab";
import LocationsTab from "./tabs/LocationsTab";
import LocationFormTab from "./tabs/LocationFormTab";
import MediaTab from "./tabs/MediaTab";
import CategoriesTab from "./tabs/CategoriesTab";
import UsersTab from "./tabs/UsersTab";
import AnalyticsTab from "./tabs/AnalyticsTab";
import SettingsTab from "./tabs/SettingsTab";

export default function AdminDashboard({ user, onLogout, onNavigate, onViewOnMap }) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview"); // overview, list, add, edit, media, users, categories, analytics, settings
  const [selectedEditLocation, setSelectedEditLocation] = useState(null);

  // ====================== QUERY LIFECYCLES ======================

  // 1. Locations
  const { data: locationsData, isLoading: isLoadingLocs } = useQuery({
    queryKey: ["locations"],
    queryFn: getAllLocations
  });
  const locations = locationsData?.data || [];

  // 2. Categories
  const { data: categoriesData, isLoading: isLoadingCats } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories
  });
  const categories = categoriesData?.data || [];

  // 3. Media List
  const { data: mediaData, isLoading: isLoadingMedia } = useQuery({
    queryKey: ["media"],
    queryFn: getAllMedia
  });
  const mediaList = mediaData?.data || [];

  // 4. Users list
  const { data: usersData, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers
  });
  const users = usersData?.data || [];

  // 5. App settings
  const { data: settingsData, isLoading: isLoadingSettings } = useQuery({
    queryKey: ["settings"],
    queryFn: getSettings
  });
  const settings = settingsData?.data || null;

  // ====================== MUTATIONS ======================

  // Create Location Mutation
  const createMutation = useMutation({
    mutationFn: createLocation,
    onSuccess: () => {
      queryClient.invalidateQueries(["locations"]);
      alert("Location created successfully!");
      setActiveTab("list");
    },
    onError: (err) => {
      alert(err.response?.data?.message || "Failed to create location.");
    }
  });

  // Update Location Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateLocation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["locations"]);
      alert("Location updated successfully!");
      setActiveTab("list");
      setSelectedEditLocation(null);
    },
    onError: (err) => {
      alert(err.response?.data?.message || "Failed to update location.");
    }
  });

  // Duplicate Location Mutation
  const duplicateMutation = useMutation({
    mutationFn: createLocation,
    onSuccess: () => {
      queryClient.invalidateQueries(["locations"]);
      alert("Location duplicated as Draft successfully!");
      setActiveTab("list");
    },
    onError: (err) => {
      alert(err.response?.data?.message || "Failed to duplicate location.");
    }
  });

  // Delete Location Mutation
  const deleteMutation = useMutation({
    mutationFn: deleteLocation,
    onSuccess: () => {
      queryClient.invalidateQueries(["locations"]);
      alert("Location deleted successfully!");
    },
    onError: (err) => {
      alert(err.response?.data?.message || "Failed to delete location.");
    }
  });

  // ====================== OPERATIONS ======================

  const handleEditClick = (loc) => {
    setSelectedEditLocation(loc);
    setActiveTab("edit");
  };

  const handleDuplicateClick = (loc) => {
    if (window.confirm(`Duplicate "${loc.name}"?`)) {
      const payload = {
        name: `${loc.name} (Copy)`,
        description: loc.description,
        address: loc.address,
        category: loc.category,
        building: loc.building,
        floor: loc.floor,
        roomNumber: loc.roomNumber,
        coordinates: loc.coordinates,
        images: loc.images,
        keywords: loc.keywords,
        status: "Draft"
      };
      duplicateMutation.mutate(payload);
    }
  };

  const handleDeleteClick = (id, name) => {
    if (window.confirm(`Are you sure you want to permanently delete "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleViewOnMap = (loc) => {
    if (onViewOnMap) {
      onViewOnMap(loc);
    }
  };

  return (
    <div className="flex-1 flex bg-muted/15 min-h-0 select-none">
      {/* 1. Permanent Side Navigation Bar */}
      <aside className="w-64 shrink-0 bg-white border-r border-border flex flex-col justify-between z-10 shadow-xs">
        <div className="p-4 space-y-6">
          {/* Admin title */}
          <div>
            <h2 className="text-[14px] font-semibold text-foreground tracking-tight uppercase">
              DTU Control Panel
            </h2>
            <p className="text-[12px] text-muted-foreground truncate">{user?.email}</p>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={cn(
                "w-full h-10 px-3 rounded-lg flex items-center gap-3 text-[13px] font-medium transition-colors focus:outline-none cursor-pointer",
                activeTab === "overview"
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-muted"
              )}
            >
              <LayoutDashboard size={16} />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab("list")}
              className={cn(
                "w-full h-10 px-3 rounded-lg flex items-center gap-3 text-[13px] font-medium transition-colors focus:outline-none cursor-pointer",
                activeTab === "list" || activeTab === "edit"
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-muted"
              )}
            >
              <MapPin size={16} />
              <span>Manage Locations</span>
            </button>

            <button
              onClick={() => {
                setSelectedEditLocation(null);
                setActiveTab("add");
              }}
              className={cn(
                "w-full h-10 px-3 rounded-lg flex items-center gap-3 text-[13px] font-medium transition-colors focus:outline-none cursor-pointer",
                activeTab === "add"
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-muted"
              )}
            >
              <PlusCircle size={16} />
              <span>Add Location</span>
            </button>

            <button
              onClick={() => setActiveTab("media")}
              className={cn(
                "w-full h-10 px-3 rounded-lg flex items-center gap-3 text-[13px] font-medium transition-colors focus:outline-none cursor-pointer",
                activeTab === "media"
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-muted"
              )}
            >
              <ImageIcon size={16} />
              <span>Media / Images</span>
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={cn(
                "w-full h-10 px-3 rounded-lg flex items-center gap-3 text-[13px] font-medium transition-colors focus:outline-none cursor-pointer",
                activeTab === "users"
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-muted"
              )}
            >
              <Users size={16} />
              <span>Manage Users</span>
            </button>

            <button
              onClick={() => setActiveTab("categories")}
              className={cn(
                "w-full h-10 px-3 rounded-lg flex items-center gap-3 text-[13px] font-medium transition-colors focus:outline-none cursor-pointer",
                activeTab === "categories"
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-muted"
              )}
            >
              <FolderOpen size={16} />
              <span>Categories</span>
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className={cn(
                "w-full h-10 px-3 rounded-lg flex items-center gap-3 text-[13px] font-medium transition-colors focus:outline-none cursor-pointer",
                activeTab === "analytics"
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-muted"
              )}
            >
              <BarChart3 size={16} />
              <span>Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={cn(
                "w-full h-10 px-3 rounded-lg flex items-center gap-3 text-[13px] font-medium transition-colors focus:outline-none cursor-pointer",
                activeTab === "settings"
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-muted"
              )}
            >
              <Settings size={16} />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-border space-y-1">
          <button
            onClick={() => onNavigate("map")}
            className="w-full h-10 px-3 rounded-lg flex items-center gap-3 text-[13px] font-medium text-foreground hover:bg-muted transition-colors focus:outline-none cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to Map</span>
          </button>
          
          <button
            onClick={onLogout}
            className="w-full h-10 px-3 rounded-lg flex items-center gap-3 text-[13px] font-medium text-red-600 hover:bg-red-50 transition-colors focus:outline-none cursor-pointer"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Content viewport board */}
      <main className="flex-1 overflow-y-auto p-8 select-text">
        {isLoadingLocs || isLoadingCats ? (
          <div className="w-full h-64 flex items-center justify-center">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : (
          <>
            {activeTab === "overview" && (
              <DashboardTab
                locations={locations}
                categories={categories}
                users={users}
                setActiveTab={setActiveTab}
                onNavigate={onNavigate}
              />
            )}

            {activeTab === "list" && (
              <LocationsTab
                locations={locations}
                categories={categories}
                onEdit={handleEditClick}
                onDuplicate={handleDuplicateClick}
                onDelete={handleDeleteClick}
                onViewOnMap={handleViewOnMap}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === "add" && (
              <LocationFormTab
                categories={categories}
                mediaList={mediaList}
                onSubmit={(data) => createMutation.mutate(data)}
                isPending={createMutation.isPending}
                onCancel={() => setActiveTab("list")}
              />
            )}

            {activeTab === "edit" && (
              <LocationFormTab
                initialData={selectedEditLocation}
                categories={categories}
                mediaList={mediaList}
                onSubmit={(data) =>
                  updateMutation.mutate({ id: selectedEditLocation._id, data })
                }
                isPending={updateMutation.isPending}
                onCancel={() => setActiveTab("list")}
              />
            )}

            {activeTab === "media" && (
              <MediaTab mediaList={mediaList} isLoadingMedia={isLoadingMedia} />
            )}

            {activeTab === "users" && (
              <UsersTab
                users={users}
                isLoadingUsers={isLoadingUsers}
                currentUser={user}
              />
            )}

            {activeTab === "categories" && (
              <CategoriesTab
                categories={categories}
                isLoadingCategories={isLoadingCats}
              />
            )}

            {activeTab === "analytics" && (
              <AnalyticsTab
                locations={locations}
                categories={categories}
                users={users}
              />
            )}

            {activeTab === "settings" && (
              <SettingsTab
                settings={settings}
                isLoadingSettings={isLoadingSettings}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
