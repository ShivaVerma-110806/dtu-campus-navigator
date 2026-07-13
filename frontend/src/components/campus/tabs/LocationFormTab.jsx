import React, { useState, useEffect, useRef } from "react";
import { X, MapPin, Search, Folder, Plus, Loader2 } from "lucide-react";
import { cn } from "../../../lib/utils";

const DTU_CENTER = { lat: 28.7501, lng: 77.1177 };

export default function LocationFormTab({
  initialData = null,
  categories = [],
  mediaList = [],
  onSubmit,
  isPending,
  onCancel
}) {
  const isEdit = !!initialData;
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const markerRef = useRef(null);

  // Form Fields State
  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [address, setAddress] = useState(initialData?.address || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [building, setBuilding] = useState(initialData?.building || "");
  const [floor, setFloor] = useState(initialData?.floor || "");
  const [roomNumber, setRoomNumber] = useState(initialData?.roomNumber || "");
  const [latitude, setLatitude] = useState(initialData?.coordinates?.latitude || 28.7501);
  const [longitude, setLongitude] = useState(initialData?.coordinates?.longitude || 77.1177);
  const [images, setImages] = useState(initialData?.images || []);
  const [keywordInput, setKeywordInput] = useState("");
  const [keywords, setKeywords] = useState(initialData?.keywords || []);
  const [status, setStatus] = useState(initialData?.status || "Published");

  // Media Library Selection Modal State
  const [mediaModalOpen, setMediaModalOpen] = useState(false);

  // 1. Auto slug generation on name change (only for new entries)
  useEffect(() => {
    if (!isEdit) {
      const generated = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(generated);
    }
  }, [name, isEdit]);

  // 2. Initialize map picker
  useEffect(() => {
    if (!mapRef.current || !window.google || !window.google.maps) return;

    const initLat = parseFloat(latitude) || DTU_CENTER.lat;
    const initLng = parseFloat(longitude) || DTU_CENTER.lng;

    const pickerMap = new window.google.maps.Map(mapRef.current, {
      center: { lat: initLat, lng: initLng },
      zoom: 17,
      disableDefaultUI: true,
      zoomControl: true
    });

    const marker = new window.google.maps.Marker({
      position: { lat: initLat, lng: initLng },
      map: pickerMap,
      draggable: true,
      title: "Drag me!"
    });

    markerRef.current = marker;
    setMap(pickerMap);

    // Map Click Listener
    pickerMap.addListener("click", (e) => {
      const newLat = e.latLng.lat();
      const newLng = e.latLng.lng();
      setLatitude(parseFloat(newLat.toFixed(6)));
      setLongitude(parseFloat(newLng.toFixed(6)));
      marker.setPosition({ lat: newLat, lng: newLng });
    });

    // Marker Drag Listener
    marker.addListener("dragend", (e) => {
      const newLat = e.latLng.lat();
      const newLng = e.latLng.lng();
      setLatitude(parseFloat(newLat.toFixed(6)));
      setLongitude(parseFloat(newLng.toFixed(6)));
    });

    return () => {
      if (markerRef.current) markerRef.current.setMap(null);
    };
  }, [isEdit]);

  // 3. Sync marker position if manual input changes
  useEffect(() => {
    const latNum = parseFloat(latitude);
    const lngNum = parseFloat(longitude);

    if (markerRef.current && map && !isNaN(latNum) && !isNaN(lngNum)) {
      const pos = { lat: latNum, lng: lngNum };
      markerRef.current.setPosition(pos);
      map.panTo(pos);
    }
  }, [latitude, longitude, map]);

  // Keyword Tags management
  const addKeyword = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      e.preventDefault();
      const val = keywordInput.trim();
      if (val && !keywords.includes(val)) {
        setKeywords([...keywords, val]);
        setKeywordInput("");
      }
    }
  };

  const removeKeyword = (idx) => {
    setKeywords(keywords.filter((_, i) => i !== idx));
  };

  // Add / Remove URL images
  const addImageUrl = (url) => {
    if (url && !images.includes(url)) {
      setImages([...images, url]);
    }
  };

  const removeImage = (idx) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  // Submit Handler
  const handleSave = (publishStatus) => {
    if (!name || !category || isNaN(parseFloat(latitude)) || isNaN(parseFloat(longitude))) {
      alert("Please fill in Name, Category, and coordinates.");
      return;
    }

    const payload = {
      name,
      slug,
      description,
      address,
      category,
      building,
      floor,
      roomNumber,
      coordinates: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      },
      images,
      keywords,
      status: publishStatus
    };

    onSubmit(payload);
  };

  return (
    <div className="space-y-8 max-w-4xl pb-12 animate-fadeIn">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-semibold text-foreground tracking-tight">
            {isEdit ? `Edit Location: ${initialData.name}` : "Create New Location"}
          </h2>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            Configure map coordinates, media previews, and directory info details.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Body Fields (Left) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Basic Information */}
          <div className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-[14px] font-semibold text-foreground">Basic Information</h3>
            
            <div className="space-y-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  Location Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mechanical Engineering Canteen"
                  className="w-full h-11 px-4 rounded-xl border border-border text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>

              {/* Slug (Auto Generated) */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  Slug URL String (Auto generated)
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="auto-generated-slug"
                  className="w-full h-11 px-4 rounded-xl border border-border text-[13px] font-mono text-muted-foreground bg-muted/40 focus:outline-none"
                  disabled={isEdit}
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide detail coordinates info or hours guidelines..."
                  rows={4}
                  className="w-full p-4 rounded-xl border border-border text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Location Information */}
          <div className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-[14px] font-semibold text-foreground">Location Properties</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider block">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-border text-[13px] font-medium bg-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Building Block */}
                <div className="space-y-1.5">
                  <label className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider block">
                    Building Block
                  </label>
                  <input
                    type="text"
                    value={building}
                    onChange={(e) => setBuilding(e.target.value)}
                    placeholder="e.g. Science Block"
                    className="w-full h-11 px-4 rounded-xl border border-border text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Floor */}
                <div className="space-y-1.5">
                  <label className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider block">
                    Floor
                  </label>
                  <input
                    type="text"
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                    placeholder="e.g. First Floor"
                    className="w-full h-11 px-4 rounded-xl border border-border text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                {/* Room Number */}
                <div className="space-y-1.5">
                  <label className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider block">
                    Room Number
                  </label>
                  <input
                    type="text"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    placeholder="e.g. Class 204"
                    className="w-full h-11 px-4 rounded-xl border border-border text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  Address Details
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Shahbad Daulatpur, Bawana Road, Delhi - 110042"
                  className="w-full h-11 px-4 rounded-xl border border-border text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Coordinates & Map Picker */}
          <div className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-[14px] font-semibold text-foreground">Map Coordinates Picker</h3>
            <p className="text-[12px] text-muted-foreground">
              Click anywhere on the map or drag the marker to capture precise lat/lng coordinates automatically.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Latitude */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  Latitude * (Y)
                </label>
                <input
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-border text-[13px] font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>

              {/* Longitude */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  Longitude * (X)
                </label>
                <input
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-border text-[13px] font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>
            </div>

            {/* Google Map Picker canvas */}
            <div className="h-64 rounded-xl border border-border overflow-hidden bg-muted relative">
              <div ref={mapRef} className="w-full h-full" />
            </div>
          </div>
        </div>

        {/* Media & Action Sidebar (Right) */}
        <div className="space-y-6">
          {/* Action Publish Panel */}
          <div className="bg-white border border-border p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-[14px] font-semibold text-foreground">Save Location</h3>
            
            <div className="flex flex-col gap-2">
              <button
                type="button"
                disabled={isPending}
                onClick={() => handleSave("Published")}
                className="w-full h-11 bg-primary text-white text-[13px] font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/95 transition-colors shadow-sm focus:outline-none cursor-pointer"
              >
                {isPending ? <Loader2 size={16} className="animate-spin" /> : "Publish Location"}
              </button>

              <button
                type="button"
                disabled={isPending}
                onClick={() => handleSave("Draft")}
                className="w-full h-11 border border-border text-foreground hover:bg-muted text-[13px] font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors focus:outline-none cursor-pointer"
              >
                Save Draft
              </button>

              <button
                type="button"
                onClick={onCancel}
                className="w-full h-11 text-muted-foreground hover:text-foreground text-[13px] font-semibold transition-colors focus:outline-none cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Cover Images Grid */}
          <div className="bg-white border border-border p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[14px] font-semibold text-foreground">Location Images</h3>
              <button
                type="button"
                onClick={() => setMediaModalOpen(true)}
                className="text-[12px] text-primary font-medium hover:underline focus:outline-none"
              >
                Browse Media
              </button>
            </div>

            {/* Images Previews */}
            <div className="space-y-2">
              {images.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {images.map((img, idx) => (
                    <div key={idx} className="aspect-square border border-border rounded-xl overflow-hidden relative group bg-muted">
                      <img src={img} alt="preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors shadow focus:outline-none"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 border border-dashed border-border rounded-xl text-center text-muted-foreground text-[12px] leading-relaxed">
                  No images selected. Use the media browser to select cover assets.
                </div>
              )}
            </div>
          </div>

          {/* Search Keywords */}
          <div className="bg-white border border-border p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-[14px] font-semibold text-foreground">Search Keywords</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={addKeyword}
                placeholder="Add tag..."
                className="flex-1 h-9 px-3 rounded-lg border border-border text-[12px] font-medium focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button
                type="button"
                onClick={addKeyword}
                className="h-9 w-9 bg-muted border border-border rounded-lg flex items-center justify-center text-foreground hover:bg-muted/80 focus:outline-none cursor-pointer"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Keyword tags collection */}
            <div className="flex flex-wrap gap-1.5">
              {keywords.map((kw, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-muted border border-border text-foreground text-[11px] font-medium rounded-md flex items-center gap-1 shrink-0"
                >
                  <span>{kw}</span>
                  <button
                    type="button"
                    onClick={() => removeKeyword(idx)}
                    className="hover:text-red-600 focus:outline-none"
                  >
                    <X size={11} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Media Browser Modal Overlay */}
      {mediaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white border border-border w-full max-w-2xl rounded-2xl shadow-xl flex flex-col overflow-hidden max-h-[85vh]">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground text-[15px]">Media Browser Library</h3>
              <button
                onClick={() => setMediaModalOpen(false)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground focus:outline-none"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
              {mediaList.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {mediaList.map((item) => {
                    const isAlreadySelected = images.includes(item.url);

                    return (
                      <button
                        key={item._id}
                        type="button"
                        onClick={() => {
                          if (isAlreadySelected) {
                            setImages(images.filter((img) => img !== item.url));
                          } else {
                            addImageUrl(item.url);
                          }
                        }}
                        className={cn(
                          "aspect-square border rounded-xl overflow-hidden relative hover:opacity-90 focus:outline-none bg-muted cursor-pointer transition-all",
                          isAlreadySelected
                            ? "border-primary ring-2 ring-primary/40 scale-95"
                            : "border-border"
                        )}
                      >
                        <img src={item.url} alt={item.filename} className="w-full h-full object-cover" />
                        <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] px-1 py-0.5 truncate text-center">
                          {item.filename.split("-").slice(1).join("-") || item.filename}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground text-[13px] space-y-2">
                  <p>No media files uploaded yet.</p>
                  <p className="text-[11px] text-muted-foreground/80">
                    Upload images in the Media/Images tab first!
                  </p>
                </div>
              )}
            </div>

            <div className="px-6 py-3.5 border-t border-border flex justify-end">
              <button
                type="button"
                onClick={() => setMediaModalOpen(false)}
                className="h-10 px-5 bg-primary text-white text-[13px] font-semibold rounded-xl hover:bg-primary/95 cursor-pointer focus:outline-none"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
