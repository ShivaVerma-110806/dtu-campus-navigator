import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Eye,
  Edit,
  Copy,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Plus
} from "lucide-react";
import { cn } from "../../../lib/utils";

const ITEMS_PER_PAGE = 8;

export default function LocationsTab({
  locations = [],
  categories = [],
  onEdit,
  onDuplicate,
  onDelete,
  onViewOnMap,
  setActiveTab
}) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // 1. Extract distinct buildings list from locations
  const buildings = useMemo(() => {
    return Array.from(new Set(locations.map((l) => l.building).filter(Boolean))).sort();
  }, [locations]);

  // 2. Perform filtering
  const filtered = useMemo(() => {
    return locations.filter((loc) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        loc.name?.toLowerCase().includes(q) ||
        loc.building?.toLowerCase().includes(q) ||
        loc.category?.toLowerCase().includes(q) ||
        loc.roomNumber?.toLowerCase().includes(q);

      const matchesCategory = !selectedCategory || loc.category === selectedCategory;
      const matchesBuilding = !selectedBuilding || loc.building === selectedBuilding;

      return matchesSearch && matchesCategory && matchesBuilding;
    });
  }, [locations, search, selectedCategory, selectedBuilding]);

  // 3. Paginate
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const paginatedLocations = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory, selectedBuilding]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-[20px] font-semibold text-foreground tracking-tight">
            Manage Locations
          </h2>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            Search, filter, edit, or duplicate navigator coordinate spots.
          </p>
        </div>
        <button
          onClick={() => setActiveTab("add")}
          className="h-10 px-4 bg-primary text-white text-[13px] font-medium rounded-xl flex items-center gap-2 hover:bg-primary/95 transition-colors cursor-pointer shadow-sm focus:outline-none shrink-0"
        >
          <Plus size={16} />
          <span>Add Location</span>
        </button>
      </div>

      {/* Search & Filter Control Bar */}
      <div className="bg-white border border-border p-4 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center gap-3">
        {/* Text Search */}
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, building, category, room..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-border text-[13px] font-medium bg-white focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        {/* Category Filter */}
        <div className="w-full md:w-48 relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full h-10 px-3.5 rounded-xl border border-border text-[13px] font-medium bg-white focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Building Filter */}
        <div className="w-full md:w-48 relative">
          <select
            value={selectedBuilding}
            onChange={(e) => setSelectedBuilding(e.target.value)}
            className="w-full h-10 px-3.5 rounded-xl border border-border text-[13px] font-medium bg-white focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="">All Buildings</option>
            {buildings.map((build) => (
              <option key={build} value={build}>
                {build}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Database Table Card */}
      <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-muted/30 border-b border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="px-6 py-3.5 w-16">Image</th>
                <th className="px-6 py-3.5">Name</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Building</th>
                <th className="px-6 py-3.5 w-20">Floor</th>
                <th className="px-6 py-3.5 w-24">Room No</th>
                <th className="px-6 py-3.5 w-28">Created Date</th>
                <th className="px-6 py-3.5 w-24">Status</th>
                <th className="px-6 py-3.5 text-right w-44">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-[13px]">
              {paginatedLocations.length > 0 ? (
                paginatedLocations.map((loc) => {
                  const image = loc.images?.[0] || "";
                  const date = loc.createdAt
                    ? new Date(loc.createdAt).toLocaleDateString()
                    : "N/A";
                  const isDraft = loc.status === "Draft";

                  return (
                    <tr key={loc._id} className="hover:bg-muted/10 transition-colors">
                      {/* Image */}
                      <td className="px-6 py-3">
                        {image ? (
                          <img
                            src={image}
                            alt={loc.name}
                            className="w-10 h-10 rounded-lg object-cover bg-muted"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-muted text-muted-foreground font-semibold uppercase flex items-center justify-center text-[10px]">
                            {loc.category?.slice(0, 2)}
                          </div>
                        )}
                      </td>

                      {/* Name */}
                      <td className="px-6 py-3 font-semibold text-foreground">
                        <span className="block max-w-[200px] truncate" title={loc.name}>
                          {loc.name}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-3 text-muted-foreground">{loc.category}</td>

                      {/* Building */}
                      <td className="px-6 py-3 text-muted-foreground">{loc.building || "N/A"}</td>

                      {/* Floor */}
                      <td className="px-6 py-3 text-muted-foreground">{loc.floor || "N/A"}</td>

                      {/* Room Number */}
                      <td className="px-6 py-3 text-muted-foreground">{loc.roomNumber || "N/A"}</td>

                      {/* Created Date */}
                      <td className="px-6 py-3 text-muted-foreground">{date}</td>

                      {/* Status */}
                      <td className="px-6 py-3">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase",
                            isDraft
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          )}
                        >
                          {loc.status || "Published"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-3 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => onViewOnMap(loc)}
                            className="p-1.5 rounded-lg border border-border text-foreground hover:bg-muted focus:outline-none"
                            title="View on Navigator Map"
                          >
                            <Eye size={13} />
                          </button>
                          
                          <button
                            onClick={() => onEdit(loc)}
                            className="p-1.5 rounded-lg border border-border text-foreground hover:bg-muted focus:outline-none"
                            title="Edit Details"
                          >
                            <Edit size={13} />
                          </button>
                          
                          <button
                            onClick={() => onDuplicate(loc)}
                            className="p-1.5 rounded-lg border border-border text-foreground hover:bg-muted focus:outline-none"
                            title="Duplicate Location"
                          >
                            <Copy size={13} />
                          </button>
                          
                          <button
                            onClick={() => onDelete(loc._id, loc.name)}
                            className="p-1.5 rounded-lg border border-border text-red-600 hover:bg-red-50 focus:outline-none"
                            title="Delete"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-muted-foreground">
                    No matching location records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginated Footer */}
        {totalPages > 1 && (
          <div className="px-6 py-3.5 border-t border-border flex items-center justify-between">
            <span className="text-[12px] text-muted-foreground">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
              {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} locations
            </span>

            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-40 disabled:hover:bg-transparent"
              >
                <ChevronLeft size={16} />
              </button>

              <span className="text-[12px] text-foreground font-semibold px-2">
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-40 disabled:hover:bg-transparent"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
