import React, { useMemo } from "react";
import { BarChart3, TrendingUp, Search, Calendar } from "lucide-react";

export default function AnalyticsTab({ locations = [], categories = [], users = [] }) {
  // 1. Locations per Category calculation
  const categorySplit = useMemo(() => {
    const counts = {};
    locations.forEach((loc) => {
      counts[loc.category] = (counts[loc.category] || 0) + 1;
    });

    return categories.map((cat) => ({
      name: cat.name,
      count: counts[cat.name] || 0
    })).sort((a, b) => b.count - a.count);
  }, [locations, categories]);

  // Max value for scaling visual progress bars
  const maxCount = useMemo(() => {
    return Math.max(...categorySplit.map((c) => c.count), 1);
  }, [categorySplit]);

  // 2. Simulated Searches (Google Analytics style metrics)
  const totalSearchMetric = 482; // Simulated total searches count
  const popularSearches = [
    { name: "Central Library", count: 184 },
    { name: "Sports Complex", count: 120 },
    { name: "Mech Canteen", count: 98 },
    { name: "Auditorium Block", count: 52 },
    { name: "Admin Block Ground Floor", count: 28 }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title */}
      <div>
        <h2 className="text-[20px] font-semibold text-foreground tracking-tight">
          System Analytics
        </h2>
        <p className="text-[13px] text-muted-foreground mt-0.5">
          Real-time database splits and user metrics from DTU Navigator.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-border p-6 rounded-2xl shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Search size={16} />
            <span className="text-[12px] font-semibold uppercase tracking-wider">Total Searches</span>
          </div>
          <p className="text-[30px] font-bold text-foreground">{totalSearchMetric}</p>
          <p className="text-[11px] text-green-600 font-semibold flex items-center gap-1">
            <TrendingUp size={12} />
            <span>+14.2% growth this week</span>
          </p>
        </div>

        <div className="bg-white border border-border p-6 rounded-2xl shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar size={16} />
            <span className="text-[12px] font-semibold uppercase tracking-wider">User Registrations</span>
          </div>
          <p className="text-[30px] font-bold text-foreground">{users.length}</p>
          <p className="text-[11px] text-muted-foreground">
            Active accounts tracking directories
          </p>
        </div>

        <div className="bg-white border border-border p-6 rounded-2xl shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <BarChart3 size={16} />
            <span className="text-[12px] font-semibold uppercase tracking-wider">Locations Mapped</span>
          </div>
          <p className="text-[30px] font-bold text-foreground">{locations.length}</p>
          <p className="text-[11px] text-muted-foreground">
            Points of Interest pinned on Google Maps
          </p>
        </div>
      </div>

      {/* Grid: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side: Locations per Category */}
        <div className="bg-white border border-border p-6 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-[14px] font-semibold text-foreground">Locations per Category</h3>
          
          <div className="space-y-4 pt-2">
            {categorySplit.map((item) => {
              const percentage = Math.round((item.count / maxCount) * 100);

              return (
                <div key={item.name} className="space-y-1.5">
                  <div className="flex justify-between text-[12px] font-semibold">
                    <span className="text-foreground">{item.name}</span>
                    <span className="text-muted-foreground">{item.count} items</span>
                  </div>
                  <div className="w-full h-3.5 bg-muted rounded-lg overflow-hidden border border-border/40">
                    <div
                      className="bg-primary h-full rounded-lg transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Popular Search terms */}
        <div className="bg-white border border-border p-6 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-[14px] font-semibold text-foreground">Most Searched Locations</h3>
          
          <div className="space-y-4 pt-2">
            {popularSearches.map((item, idx) => {
              const maxSearch = popularSearches[0].count;
              const percentage = Math.round((item.count / maxSearch) * 100);

              return (
                <div key={item.name} className="space-y-1.5">
                  <div className="flex justify-between text-[12px] font-semibold">
                    <span className="text-foreground">
                      {idx + 1}. {item.name}
                    </span>
                    <span className="text-muted-foreground">{item.count} hits</span>
                  </div>
                  <div className="w-full h-3.5 bg-muted rounded-lg overflow-hidden border border-border/40">
                    <div
                      className="bg-green-600 h-full rounded-lg transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
