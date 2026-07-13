import React, { useState, useRef, useEffect } from "react";
import { Search, X, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";

export default function SearchBar({
  value,
  onChange,
  locations = [],
  onSelect,
  autoFocus = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef(null);

  // Close suggestions if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter matching suggestions (cap at 6)
  const suggestions = React.useMemo(() => {
    if (!value || value.trim() === "") return [];
    const query = value.toLowerCase().trim();
    return locations
      .filter((loc) => {
        const nameMatch = loc.name?.toLowerCase().includes(query);
        const buildingMatch = loc.building?.toLowerCase().includes(query);
        const categoryMatch = loc.category?.toLowerCase().includes(query);
        return nameMatch || buildingMatch || categoryMatch;
      })
      .slice(0, 6);
  }, [value, locations]);

  // Sync suggestion visibility
  useEffect(() => {
    if (suggestions.length > 0) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
    setActiveIndex(-1);
  }, [suggestions]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        handleSelectItem(suggestions[activeIndex]);
      } else if (suggestions.length > 0) {
        handleSelectItem(suggestions[0]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      e.target.blur();
    }
  };

  const handleSelectItem = (item) => {
    onSelect(item);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Search Input Box */}
      <div
        className={cn(
          "w-full h-12 rounded-full bg-white border border-border px-4 flex items-center gap-3 transition-shadow duration-150 shadow-sm",
          "focus-within:shadow-md focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent"
        )}
      >
        <Search className="text-muted-foreground shrink-0" size={20} />
        
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus={autoFocus}
          placeholder="Search buildings, classrooms, hostels..."
          className="flex-1 bg-transparent border-none outline-none text-[14px] text-foreground placeholder-muted-foreground w-full font-medium"
        />

        {value && (
          <button
            onClick={() => onChange("")}
            className="p-1 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none"
            aria-label="Clear search query"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <ul
          role="listbox"
          className="absolute left-0 right-0 top-full mt-2 bg-white border border-border rounded-2xl shadow-lg z-50 overflow-hidden divide-y divide-border"
        >
          {suggestions.map((loc, idx) => (
            <li
              key={loc._id}
              role="option"
              aria-selected={idx === activeIndex}
              onClick={() => handleSelectItem(loc)}
              className={cn(
                "w-full px-4 py-3 flex items-center justify-between cursor-pointer transition-colors duration-150",
                idx === activeIndex ? "bg-muted" : "hover:bg-muted"
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                {loc.thumbnail ? (
                  <img
                    src={loc.thumbnail}
                    alt={loc.name}
                    className="w-11 h-11 rounded-lg object-cover shrink-0"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-lg bg-muted flex items-center justify-center text-muted-foreground font-semibold uppercase shrink-0 text-xs">
                    {loc.category.slice(0, 2)}
                  </div>
                )}
                <div className="text-left min-w-0">
                  <h4 className="text-[14px] font-medium text-foreground truncate">
                    {loc.name}
                  </h4>
                  <p className="text-[12px] text-muted-foreground truncate">
                    {loc.building} &middot; {loc.category}
                  </p>
                </div>
              </div>
              <ChevronRight size={16} className="text-muted-foreground shrink-0" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
