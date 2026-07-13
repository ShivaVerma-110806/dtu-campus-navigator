import React, { useEffect, useRef } from "react";
import {
  X,
  Navigation,
  Share2,
  Clock,
  Building2,
  MapPin,
  Hash,
  Phone,
  Globe
} from "lucide-react";
import { cn } from "../../lib/utils";

export default function LocationDrawer({ location, onClose, isMobile = false }) {
  const drawerRef = useRef(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!location) return null;

  const imageUrl = location.images && location.images[0]
    ? location.images[0]
    : "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&auto=format&fit=crop&q=80";

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: location.name,
        text: `Find ${location.name} on the DTU Campus Navigator`,
        url: window.location.href
      }).catch(console.error);
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Location link copied to clipboard!");
    }
  };

  const handleNavigate = () => {
    if (location.coordinates) {
      const { latitude, longitude } = location.coordinates;
      const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
      window.open(url, "_blank");
    }
  };

  const drawerContent = (
    <div className="flex flex-col h-full bg-white overflow-hidden relative">
      {/* 192px Cover Image Area */}
      <div className="h-48 w-full relative shrink-0">
        <img
          src={imageUrl}
          alt={location.name}
          className="w-full h-full object-cover"
        />
        {/* Close Button overlay top-right */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 text-foreground hover:bg-white shadow-md flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
          aria-label="Close details"
        >
          <X size={18} />
        </button>
      </div>

      {/* Main Drawer Content (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Eyebrow and Title */}
        <div>
          <span className="text-[12px] font-semibold text-primary uppercase tracking-wider block mb-1">
            {location.categoryLabel || location.category}
          </span>
          <h2 className="text-[20px] font-semibold text-foreground tracking-tight leading-snug">
            {location.name}
          </h2>
        </div>

        {/* Action Row */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleNavigate}
            className="flex-1 h-10 px-4 bg-primary text-white rounded-full flex items-center justify-center gap-2 hover:bg-primary/90 transition-all font-medium text-[14px] shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
          >
            <Navigation size={16} className="fill-current" />
            <span>Navigate</span>
          </button>
          
          <button
            onClick={handleShare}
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-muted active:bg-muted/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
            aria-label="Share location"
          >
            <Share2 size={16} />
          </button>
        </div>

        {/* Description paragraph */}
        <p className="text-[14px] leading-relaxed text-muted-foreground font-normal">
          {location.description || "No description available for this campus location."}
        </p>

        {/* Divided Info Card List */}
        <div className="border border-border rounded-xl divide-y divide-border overflow-hidden">
          {/* Opening Hours */}
          {location.openingHours && (location.openingHours.open || location.openingHours.close) && (
            <div className="p-3.5 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center shrink-0">
                <Clock size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
                  Hours
                </p>
                <p className="text-[14px] font-semibold text-foreground mt-0.5">
                  {location.openingHours.open}
                  {location.openingHours.close ? ` – ${location.openingHours.close}` : ""}
                </p>
              </div>
            </div>
          )}

          {/* Building */}
          {location.building && (
            <div className="p-3.5 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center shrink-0">
                <Building2 size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
                  Building
                </p>
                <p className="text-[14px] font-semibold text-foreground mt-0.5">
                  {location.building}
                </p>
              </div>
            </div>
          )}

          {/* Floor */}
          {location.floor && (
            <div className="p-3.5 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center shrink-0">
                <MapPin size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
                  Floor
                </p>
                <p className="text-[14px] font-semibold text-foreground mt-0.5">
                  {location.floor}
                </p>
              </div>
            </div>
          )}

          {/* Room / Room Number */}
          {location.roomNumber && (
            <div className="p-3.5 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center shrink-0">
                <Hash size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
                  Room
                </p>
                <p className="text-[14px] font-semibold text-foreground mt-0.5">
                  {location.roomNumber}
                </p>
              </div>
            </div>
          )}

          {/* Coordinates */}
          {location.coordinates && (
            <div className="p-3.5 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center shrink-0">
                <MapPin size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
                  Coordinates
                </p>
                <p className="text-[14px] font-semibold text-foreground mt-0.5 font-mono">
                  {location.coordinates.latitude.toFixed(6)}, {location.coordinates.longitude.toFixed(6)}
                </p>
              </div>
            </div>
          )}

          {/* Phone (Optional) */}
          {location.phone && (
            <div className="p-3.5 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center shrink-0">
                <Phone size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
                  Contact
                </p>
                <p className="text-[14px] font-semibold text-foreground mt-0.5">
                  {location.phone}
                </p>
              </div>
            </div>
          )}

          {/* Website (Optional) */}
          {location.website && (
            <div className="p-3.5 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center shrink-0">
                <Globe size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
                  Website
                </p>
                <a
                  href={location.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[14px] font-semibold text-primary hover:underline mt-0.5 block truncate"
                >
                  {location.website.replace("https://", "").replace("http://", "")}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col justify-end pointer-events-none">
        {/* Backdrop for click out, not dimmed as per spec but intercepts clicks */}
        <div
          onClick={onClose}
          className="absolute inset-0 bg-transparent pointer-events-auto"
        />
        
        {/* Sliding bottom sheet */}
        <div
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          className="w-full bg-white rounded-t-2xl shadow-xl border-t border-border flex flex-col pointer-events-auto select-text max-h-[75vh]"
          style={{
            animation: "slideUp 180ms cubic-bezier(0.1, 0.9, 0.2, 1) forwards"
          }}
        >
          {/* Drag Handle indicator */}
          <div className="w-full py-2 flex items-center justify-center shrink-0">
            <div className="w-10 h-1 bg-border rounded-full" />
          </div>
          <div className="flex-1 overflow-y-auto">
            {drawerContent}
          </div>
        </div>
      </div>
    );
  }

  // Desktop Floating Drawer
  return (
    <div
      ref={drawerRef}
      role="dialog"
      className="absolute left-4 top-4 bottom-4 w-[380px] bg-white rounded-2xl shadow-lg border border-border overflow-hidden z-30 select-text"
      style={{
        animation: "fadeInLeft 150ms ease-out"
      }}
    >
      {drawerContent}
    </div>
  );
}
