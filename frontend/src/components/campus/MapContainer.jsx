import React, { useEffect, useRef, useState } from "react";
import { Plus, Minus, LocateFixed, Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

// DTU Campus Center
const DTU_CENTER = { lat: 28.7501, lng: 77.1177 };

export default function MapContainer({
  locations = [],
  selectedId = null,
  onSelect,
  activeCategory = null,
  googleMapsKey = "",
  defaultCenter = null
}) {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const markersRef = useRef({});
  const [isLoaded, setIsLoaded] = useState(false);

  const center = defaultCenter || { lat: 28.7501, lng: 77.1177 };

  // 1. Dynamic injection of Google Maps Script using configured key
  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.Map) {
      setIsLoaded(true);
      return;
    }

    const apiKey = googleMapsKey || import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
    
    // Prevent duplicate script injection
    const existingScript = document.querySelector('script[src^="https://maps.googleapis.com/"]');
    if (existingScript) {
      const interval = setInterval(() => {
        if (window.google && window.google.maps && window.google.maps.Map) {
          setIsLoaded(true);
          clearInterval(interval);
        }
      }, 50);
      return () => clearInterval(interval);
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&loading=async&libraries=geometry`;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsLoaded(true);
    document.head.appendChild(script);
  }, [googleMapsKey]);

  // 2. Initialize Google Map
  useEffect(() => {
    if (!isLoaded || !mapRef.current || map) return;

    try {
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: center,
        zoom: 16.5,
        disableDefaultUI: true,
        gestureHandling: "cooperative",
        clickableIcons: false,
        styles: [
          {
            featureType: "all",
            elementType: "geometry",
            stylers: [{ color: "#F5F6F7" }]
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#E0E4E7" }]
          },
          {
            featureType: "landscape.man_made",
            elementType: "geometry",
            stylers: [{ color: "#FFFFFF" }]
          },
          {
            featureType: "poi.park",
            elementType: "geometry",
            stylers: [{ color: "#E2EBD3" }]
          },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#FFFFFF" }]
          },
          {
            featureType: "road.arterial",
            elementType: "geometry",
            stylers: [{ color: "#EBEBEB" }]
          },
          {
            featureType: "road",
            elementType: "labels.text.fill",
            stylers: [{ color: "#77797D" }]
          },
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]
      });

      setMap(mapInstance);
    } catch (e) {
      console.error("Map initialization failed: ", e);
    }
  }, [isLoaded, map]);

  // 3. Sync Markers with Locations Data
  useEffect(() => {
    if (!map || !window.google || !window.google.maps || !window.google.maps.Marker) return;

    // Clear old markers
    Object.values(markersRef.current).forEach((marker) => marker.setMap(null));
    markersRef.current = {};

    locations.forEach((loc) => {
      const lat = loc.coordinates?.latitude;
      const lng = loc.coordinates?.longitude;

      if (lat === undefined || lng === undefined) return;

      const isSelected = loc._id === selectedId;

      try {
        const marker = new window.google.maps.Marker({
          position: { lat, lng },
          map: map,
          title: loc.name,
          icon: {
            path: "M 0 0 C -12 -12 -14 -28 0 -28 C 14 -28 12 -12 0 0 Z",
            fillColor: isSelected ? "#4285F4" : "#8A3FFC",
            fillOpacity: 0.9,
            strokeColor: "#FFFFFF",
            strokeWeight: isSelected ? 2.5 : 1.5,
            scale: isSelected ? 1.3 : 1,
            anchor: new window.google.maps.Point(0, 0)
          }
        });

        marker.addListener("click", () => {
          onSelect(loc);
        });

        markersRef.current[loc._id] = marker;
      } catch (err) {
        console.error("Failed to create marker for location: ", loc.name, err);
      }
    });

    // Cleanup markers on unmount
    return () => {
      Object.values(markersRef.current).forEach((marker) => marker.setMap(null));
      markersRef.current = {};
    };
  }, [locations, map, selectedId, onSelect]);

  // 4. Center map on selection
  useEffect(() => {
    if (!map || !selectedId) return;

    const selectedLoc = locations.find((loc) => loc._id === selectedId);
    if (selectedLoc && selectedLoc.coordinates) {
      const lat = selectedLoc.coordinates.latitude;
      const lng = selectedLoc.coordinates.longitude;
      map.panTo({ lat, lng });
      map.setZoom(18);
    }
  }, [selectedId, locations, map]);

  // Map Navigation Functions (Floating actions)
  const zoomIn = () => {
    if (map) map.setZoom(map.getZoom() + 1);
  };

  const zoomOut = () => {
    if (map) map.setZoom(map.getZoom() - 1);
  };

  const locateCenter = () => {
    if (map) {
      map.panTo(center);
      map.setZoom(16.5);
    }
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#F5F6F7]">
      {/* Map SDK Container */}
      <div ref={mapRef} className="w-full h-full" />

      {/* Loading overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#F5F6F7] flex items-center justify-center z-20">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      )}

      {/* Attribution Badge */}
      <div className="absolute bottom-3 left-4 bg-white/85 backdrop-blur-xs px-2 py-0.5 rounded-md text-[10px] text-muted-foreground border border-border pointer-events-none select-none z-10">
        DTU Campus &middot; Map data &copy; Google Maps
      </div>

      {/* Floating Action Buttons Controls (Bottom Right) */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-30">
        <div className="flex flex-col bg-white border border-border rounded-full shadow-md overflow-hidden">
          <button
            onClick={zoomIn}
            className="w-10 h-10 flex items-center justify-center text-foreground hover:bg-muted active:bg-muted/80 border-b border-border transition-colors duration-150 focus:outline-none"
            aria-label="Zoom in"
          >
            <Plus size={18} />
          </button>
          <button
            onClick={zoomOut}
            className="w-10 h-10 flex items-center justify-center text-foreground hover:bg-muted active:bg-muted/80 transition-colors duration-150 focus:outline-none"
            aria-label="Zoom out"
          >
            <Minus size={18} />
          </button>
        </div>

        <button
          onClick={locateCenter}
          className="w-10 h-10 bg-white border border-border rounded-full flex items-center justify-center text-foreground hover:bg-muted active:bg-muted/80 shadow-md transition-all duration-150 focus:outline-none"
          aria-label="Recenter Map"
        >
          <LocateFixed size={18} />
        </button>
      </div>
    </div>
  );
}
