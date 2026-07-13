import React from "react";
import { X, Search, ChevronRight } from "lucide-react";
import SearchBar from "./SearchBar";
import CategoryCards from "./CategoryCards";
import { cn } from "../../lib/utils";

export default function MobileSearchSheet({
  isOpen = false,
  onClose,
  locations = [],
  onSelectLocation,
  searchQuery = "",
  onSearchChange,
  activeCategory = null,
  onToggleCategory
}) {
  if (!isOpen) return null;

  // Filter matching suggestions
  const suggestions = React.useMemo(() => {
    if (!searchQuery || searchQuery.trim() === "") return [];
    const query = searchQuery.toLowerCase().trim();
    return locations.filter((loc) => {
      const nameMatch = loc.name?.toLowerCase().includes(query);
      const buildingMatch = loc.building?.toLowerCase().includes(query);
      const categoryMatch = loc.category?.toLowerCase().includes(query);
      return nameMatch || buildingMatch || categoryMatch;
    });
  }, [searchQuery, locations]);

  const handleSelect = (item) => {
    onSelectLocation(item);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-white z-50 flex flex-col"
      style={{
        animation: "fadeIn 150ms ease-out forwards"
      }}
    >
      {/* Top Search bar row */}
      <div className="p-4 border-b border-border flex items-center gap-3 shrink-0">
        <div className="flex-1">
          <SearchBar
            value={searchQuery}
            onChange={onSearchChange}
            locations={locations}
            onSelect={handleSelect}
            autoFocus={true}
          />
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full flex items-center justify-center text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/50 shrink-0"
          aria-label="Close search overlay"
        >
          <X size={20} />
        </button>
      </div>

      {/* Sheet Contents */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* If no query, show categories */}
        {searchQuery.trim() === "" ? (
          <div className="space-y-4">
            <span className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider block">
              Categories
            </span>
            <CategoryCards
              activeId={activeCategory}
              onToggle={(catId) => {
                onToggleCategory(catId);
                // After selection in categories, if on mobile, we can close the sheet to show the pins immediately on map
                if (catId) {
                  onClose();
                }
              }}
            />

            {/* Popular Quick-links list */}
            <div className="space-y-3 pt-2">
              <span className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider block">
                Popular Places
              </span>
              <div className="divide-y divide-border border border-border rounded-xl overflow-hidden">
                {locations
                  .filter((l) => l.popular)
                  .map((loc) => (
                    <button
                      key={loc._id}
                      onClick={() => handleSelect(loc)}
                      className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-muted transition-colors active:bg-muted/80 focus:outline-none"
                    >
                      <div className="min-w-0">
                        <h4 className="text-[14px] font-medium text-foreground truncate">
                          {loc.name}
                        </h4>
                        <p className="text-[12px] text-muted-foreground truncate">
                          {loc.building} &middot; {loc.category}
                        </p>
                      </div>
                      <ChevronRight size={16} className="text-muted-foreground shrink-0" />
                    </button>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          /* If query exists, show matching results */
          <div className="space-y-3">
            <span className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider block">
              Matching Search Results ({suggestions.length})
            </span>
            {suggestions.length > 0 ? (
              <div className="divide-y divide-border border border-border rounded-xl overflow-hidden">
                {suggestions.map((loc) => (
                  <button
                    key={loc._id}
                    onClick={() => handleSelect(loc)}
                    className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-muted transition-colors active:bg-muted/80 focus:outline-none"
                  >
                    <div className="flex items-center gap-3 min-w-0">
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
                        <h4 className="text-[14px] font-medium text-foreground truncate">
                          {loc.name}
                        </h4>
                        <p className="text-[12px] text-muted-foreground truncate">
                          {loc.building} &middot; {loc.category}
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-muted-foreground shrink-0" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-muted-foreground text-[14px]">
                No search results match "{searchQuery}".
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
