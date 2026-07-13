import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSettings } from "../../../services/locationService";
import { Save, Loader2, Settings } from "lucide-react";

export default function SettingsTab({ settings = null, isLoadingSettings }) {
  const queryClient = useQueryClient();

  const [appName, setAppName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [defaultLat, setDefaultLat] = useState(28.7501);
  const [defaultLng, setDefaultLng] = useState(77.1177);
  const [theme, setTheme] = useState("light");
  const [googleMapsKey, setGoogleMapsKey] = useState("");

  // Sync state when settings are loaded
  useEffect(() => {
    if (settings) {
      setAppName(settings.appName || "FindMyWay");
      setLogoUrl(settings.logoUrl || "");
      setDefaultLat(settings.defaultLat || 28.7501);
      setDefaultLng(settings.defaultLng || 77.1177);
      setTheme(settings.theme || "light");
      setGoogleMapsKey(settings.googleMapsKey || "");
    }
  }, [settings]);

  // Mutation
  const saveMutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries(["settings"]);
      alert("Settings saved successfully!");
    },
    onError: (err) => {
      alert(err.response?.data?.message || "Failed to save settings.");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      appName,
      logoUrl,
      defaultLat: parseFloat(defaultLat),
      defaultLng: parseFloat(defaultLng),
      theme,
      googleMapsKey
    };
    saveMutation.mutate(payload);
  };

  return (
    <div className="space-y-6 max-w-2xl animate-fadeIn">
      {/* Title */}
      <div>
        <h2 className="text-[20px] font-semibold text-foreground tracking-tight flex items-center gap-2">
          <Settings size={20} className="text-primary" />
          <span>System Settings</span>
        </h2>
        <p className="text-[13px] text-muted-foreground mt-0.5">
          Configure branding options, focus coordinates, and Google Maps API tokens.
        </p>
      </div>

      {isLoadingSettings ? (
        <div className="py-12 flex justify-center bg-white border border-border rounded-2xl">
          <Loader2 className="animate-spin text-primary" size={28} />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-4">
          {/* App Name */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider block">
              Application Title Name
            </label>
            <input
              type="text"
              required
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border text-[13px] font-medium bg-white focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Logo URL */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider block">
              Custom Logo Image URL
            </label>
            <input
              type="text"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="e.g. https://www.dtu.ac.in/logo.png"
              className="w-full h-11 px-4 rounded-xl border border-border text-[13px] font-medium bg-white focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Grid: Maps Lat/Lng focus */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider block">
                Default Map Latitude
              </label>
              <input
                type="number"
                step="any"
                required
                value={defaultLat}
                onChange={(e) => setDefaultLat(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-border text-[13px] font-mono bg-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider block">
                Default Map Longitude
              </label>
              <input
                type="number"
                step="any"
                required
                value={defaultLng}
                onChange={(e) => setDefaultLng(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-border text-[13px] font-mono bg-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          {/* Google Maps API Key */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider block">
              Google Maps API Key
            </label>
            <input
              type="text"
              value={googleMapsKey}
              onChange={(e) => setGoogleMapsKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full h-11 px-4 rounded-xl border border-border text-[13px] font-mono bg-white focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <p className="text-[11px] text-muted-foreground font-normal leading-normal">
              Used to initialize Maps canvas scripts without developer credentials warnings.
            </p>
          </div>

          {/* Default Theme */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider block">
              Default App Theme
            </label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-border text-[13px] font-medium bg-white focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="light">Light Mode</option>
              <option value="dark">Dark Mode</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="w-full h-11 bg-primary text-white text-[13px] font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/95 transition-colors shadow-sm focus:outline-none cursor-pointer mt-2"
          >
            {saveMutation.isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            <span>Save Settings</span>
          </button>
        </form>
      )}
    </div>
  );
}
