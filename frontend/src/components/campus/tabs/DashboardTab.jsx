import React from "react";
import {
  MapPin,
  Building2,
  Layers,
  Users,
  PlusCircle,
  Image as ImageIcon,
  FolderOpen,
  Map,
  ArrowRight,
  Activity
} from "lucide-react";

export default function DashboardTab({
  locations = [],
  categories = [],
  users = [],
  setActiveTab,
  onNavigate
}) {
  // Metrics calculations
  const totalLocations = locations.length;
  const totalBuildings = new Set(locations.map((l) => l.building).filter(Boolean)).size;
  const totalCategories = categories.length;
  const totalUsers = users.length;

  const recentLocations = [...locations]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // Simulated activity feed based on actual locations / user dates
  const activities = React.useMemo(() => {
    const list = [];
    recentLocations.forEach((loc) => {
      list.push({
        id: `loc-${loc._id}`,
        type: "location",
        text: `New location "${loc.name}" was published in category "${loc.category}".`,
        time: new Date(loc.createdAt).toLocaleDateString()
      });
    });
    users.slice(0, 3).forEach((u) => {
      list.push({
        id: `user-${u._id}`,
        type: "user",
        text: `User account "${u.name}" (${u.email}) joined FindMyWay.`,
        time: new Date(u.createdAt || Date.now()).toLocaleDateString()
      });
    });
    return list.slice(0, 6);
  }, [recentLocations, users]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Page Title */}
      <div>
        <h2 className="text-[22px] font-semibold text-foreground tracking-tight">
          System Dashboard
        </h2>
        <p className="text-[13px] text-muted-foreground mt-0.5">
          General status and quick administrative actions for DTU Navigator.
        </p>
      </div>

      {/* 2. Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-border p-6 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">
              Total Locations
            </p>
            <p className="text-[32px] font-bold text-foreground">{totalLocations}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <MapPin size={22} />
          </div>
        </div>

        <div className="bg-white border border-border p-6 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">
              Total Buildings
            </p>
            <p className="text-[32px] font-bold text-foreground">{totalBuildings}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
            <Building2 size={22} />
          </div>
        </div>

        <div className="bg-white border border-border p-6 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">
              Categories
            </p>
            <p className="text-[32px] font-bold text-foreground">{totalCategories}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Layers size={22} />
          </div>
        </div>

        <div className="bg-white border border-border p-6 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">
              Total Users
            </p>
            <p className="text-[32px] font-bold text-foreground">{totalUsers}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users size={22} />
          </div>
        </div>
      </div>

      {/* 3. Grid: Quick Actions & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Activity feed / Recent locations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Activity */}
          <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center gap-2">
              <Activity size={16} className="text-primary" />
              <h3 className="text-[14px] font-semibold text-foreground">Recent Activity Feed</h3>
            </div>
            <div className="divide-y divide-border">
              {activities.length > 0 ? (
                activities.map((act) => (
                  <div key={act.id} className="p-4 flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] text-foreground font-normal leading-relaxed">
                        {act.text}
                      </p>
                      <span className="text-[11px] text-muted-foreground mt-1 block">
                        {act.time}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground text-[13px]">
                  No system updates recorded yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Quick Action Buttons */}
        <div className="space-y-6">
          <div className="bg-white border border-border p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-[14px] font-semibold text-foreground">Quick Console Actions</h3>
            
            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => setActiveTab("add")}
                className="w-full h-11 px-4 border border-border rounded-xl flex items-center justify-between text-[13px] font-medium text-foreground hover:bg-muted transition-colors cursor-pointer focus:outline-none"
              >
                <div className="flex items-center gap-2.5">
                  <PlusCircle size={16} className="text-primary" />
                  <span>Add New Location</span>
                </div>
                <ArrowRight size={14} className="text-muted-foreground" />
              </button>

              <button
                onClick={() => setActiveTab("media")}
                className="w-full h-11 px-4 border border-border rounded-xl flex items-center justify-between text-[13px] font-medium text-foreground hover:bg-muted transition-colors cursor-pointer focus:outline-none"
              >
                <div className="flex items-center gap-2.5">
                  <ImageIcon size={16} className="text-green-600" />
                  <span>Upload Images</span>
                </div>
                <ArrowRight size={14} className="text-muted-foreground" />
              </button>

              <button
                onClick={() => setActiveTab("categories")}
                className="w-full h-11 px-4 border border-border rounded-xl flex items-center justify-between text-[13px] font-medium text-foreground hover:bg-muted transition-colors cursor-pointer focus:outline-none"
              >
                <div className="flex items-center gap-2.5">
                  <FolderOpen size={16} className="text-purple-600" />
                  <span>Manage Categories</span>
                </div>
                <ArrowRight size={14} className="text-muted-foreground" />
              </button>

              <button
                onClick={() => onNavigate("map")}
                className="w-full h-11 px-4 border border-border rounded-xl flex items-center justify-between text-[13px] font-medium text-foreground hover:bg-muted transition-colors cursor-pointer focus:outline-none"
              >
                <div className="flex items-center gap-2.5">
                  <Map size={16} className="text-blue-600" />
                  <span>View Navigation Map</span>
                </div>
                <ArrowRight size={14} className="text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
