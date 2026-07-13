import React from "react";
import SearchBar from "./SearchBar";
import CategoryCards from "./CategoryCards";
import { cn } from "../../lib/utils";

export default function SearchPanel({
  locations = [],
  selectedLocationId = null,
  onSelectLocation,
  activeCategory = null,
  onToggleCategory,
  searchQuery = "",
  onSearchChange
}) {
  // Determine locations to display in list:
  // If a category filter is active, or if search query is entered, display results.
  // Otherwise, display "Popular / Nearby Places" (first 5 popular or default locations).
  const isFiltering = searchQuery.trim() !== "" || activeCategory !== null;

  const filteredLocations = React.useMemo(() => {
    let result = locations;

    if (activeCategory) {
      const activeCat = activeCategory.toLowerCase();
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
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((loc) => {
        return (
          loc.name?.toLowerCase().includes(q) ||
          loc.building?.toLowerCase().includes(q) ||
          loc.category?.toLowerCase().includes(q)
        );
      });
    }

    return result;
  }, [locations, activeCategory, searchQuery]);

  const listTitle = isFiltering ? "SEARCH RESULTS" : "NEARBY PLACES";
  
  const displayLocations = React.useMemo(() => {
    if (isFiltering) {
      return filteredLocations;
    }
    // Show 5 popular or default places
    return locations.filter((l) => l.popular).slice(0, 5);
  }, [isFiltering, filteredLocations, locations]);

  return (
    <aside className="w-[380px] h-full shrink-0 border-r border-border bg-white flex flex-col z-10 overflow-hidden">
      {/* Scrollable Container with 20px padding and 24px vertical gaps */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* 1. Header Block */}
        <div>
          <h1 className="text-[18px] font-medium text-foreground tracking-tight">
            Explore DTU Campus
          </h1>
          <p className="text-[13px] text-muted-foreground mt-1">
            Find classrooms, buildings, canteens, hostels, and services.
          </p>
        </div>

        {/* 2. Search Bar */}
        <SearchBar
          value={searchQuery}
          onChange={onSearchChange}
          locations={locations}
          onSelect={onSelectLocation}
        />

        {/* 3. Categories Grid */}
        <div className="space-y-2">
          <span className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider block select-none">
            Categories
          </span>
          <CategoryCards activeId={activeCategory} onToggle={onToggleCategory} />
        </div>

        {/* 4. Dynamic Nearby/Search Results List */}
        <div className="space-y-3">
          <span className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider block select-none">
            {listTitle} ({displayLocations.length})
          </span>
          
          {displayLocations.length > 0 ? (
            <div className="space-y-1">
              {displayLocations.map((loc) => {
                const isSelected = loc._id === selectedLocationId;

                return (
                  <button
                    key={loc._id}
                    onClick={() => onSelectLocation(loc)}
                    className={cn(
                      "w-full p-2.5 rounded-xl border border-transparent flex items-center gap-3 hover:bg-muted text-left transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary/50",
                      isSelected && "bg-muted border-border"
                    )}
                  >
                    {/* 40px Thumbnail */}
                    {loc.thumbnail ? (
                      <img
                        src={loc.thumbnail}
                        alt={loc.name}
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground font-semibold uppercase shrink-0 text-xs">
                        {loc.category.slice(0, 2)}
                      </div>
                    )}

                    <div className="min-w-0">
                      <h4 className="text-[13px] font-medium text-foreground truncate">
                        {loc.name}
                      </h4>
                      <p className="text-[12px] text-muted-foreground truncate">
                        {loc.building} &middot; {loc.category}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground text-[13px]">
              No locations found matching your filters.
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
