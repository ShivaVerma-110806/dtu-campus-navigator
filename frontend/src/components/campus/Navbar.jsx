import React, { useState, useRef, useEffect } from "react";
import { MapPin, User, LogOut, LayoutDashboard, Search, ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

export default function Navbar({ user, appName = "FindMyWay", onOpenSearch, onNavigate, onLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full h-14 sm:h-16 bg-background border-b border-border flex items-center justify-between px-4 sm:px-6 select-none shrink-0">
      {/* Brand logo & wordmark */}
      <div 
        onClick={() => onNavigate("map")} 
        className="flex items-center gap-2 cursor-pointer"
      >
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
          <MapPin size={18} className="fill-current" />
        </div>
        <span className="font-sans font-medium text-[15px] tracking-tight text-foreground">
          {appName}
        </span>
      </div>

      {/* Mobile Search Button (Center, only shown on mobile/tablet < 1024px) */}
      <div className="flex-1 max-w-md mx-4 lg:hidden">
        <button
          onClick={onOpenSearch}
          className="w-full h-10 px-4 rounded-full border border-border bg-muted flex items-center gap-2 text-muted-foreground text-[13px] text-left hover:bg-muted/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <Search size={16} />
          <span className="truncate">Search buildings, classrooms...</span>
        </button>
      </div>

      {/* Actions (Right) */}
      <div className="flex items-center gap-3 relative" ref={dropdownRef}>
        {user ? (
          <>
            {/* Authenticated Dropdown trigger */}
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="h-10 px-3.5 rounded-full border border-border flex items-center gap-2 hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase">
                {user.name?.slice(0, 1)}
              </div>
              <span className="hidden sm:inline text-[13px] font-semibold text-foreground max-w-[120px] truncate">
                {user.name}
              </span>
              <ChevronDown size={14} className="text-muted-foreground shrink-0" />
            </button>

            {/* Dropdown Options List */}
            {dropdownOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-48 bg-white border border-border rounded-xl shadow-lg z-50 overflow-hidden divide-y divide-border"
                style={{ animation: "fadeIn 100ms ease-out" }}
              >
                <div className="px-4 py-2.5 text-left">
                  <p className="text-[12px] font-semibold text-foreground truncate">{user.name}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                </div>
                
                <div className="py-1">
                  {user.role === "admin" && (
                    <button
                      onClick={() => {
                        onNavigate("admin");
                        setDropdownOpen(false);
                      }}
                      className="w-full h-9 px-4 flex items-center gap-2.5 text-left text-[13px] font-medium text-foreground hover:bg-muted focus:outline-none"
                    >
                      <LayoutDashboard size={15} />
                      <span>Admin Control Panel</span>
                    </button>
                  )}
                  
                  <button
                    onClick={() => {
                      onLogout();
                      setDropdownOpen(false);
                    }}
                    className="w-full h-9 px-4 flex items-center gap-2.5 text-left text-[13px] font-medium text-red-600 hover:bg-red-50 focus:outline-none"
                  >
                    <LogOut size={15} />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Guest Actions */
          <>
            <button
              onClick={() => onNavigate("login")}
              className="hidden sm:inline-flex px-4 py-1.5 rounded-full text-[13px] font-medium hover:bg-muted text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
            >
              Sign in
            </button>
            <button
              onClick={() => onNavigate("login")}
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
              aria-label="User profile login"
            >
              <User size={18} />
            </button>
          </>
        )}
      </div>
    </header>
  );
}
