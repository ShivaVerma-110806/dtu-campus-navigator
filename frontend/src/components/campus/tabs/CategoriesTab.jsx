import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCategory,
  updateCategory,
  deleteCategory
} from "../../../services/locationService";
import {
  Plus,
  Edit,
  Trash2,
  X,
  Loader2,
  BookOpen,
  Home,
  Coffee,
  Book,
  Trophy,
  HeartPulse,
  Car,
  ShieldAlert,
  Bus,
  Projector,
  MapPin
} from "lucide-react";
import { cn } from "../../../lib/utils";

// Allowed Lucide icon lists for selectors
const AVAILABLE_ICONS = {
  BookOpen: BookOpen,
  Home: Home,
  Coffee: Coffee,
  Book: Book,
  Trophy: Trophy,
  HeartPulse: HeartPulse,
  Car: Car,
  ShieldAlert: ShieldAlert,
  Bus: Bus,
  Projector: Projector,
  MapPin: MapPin
};

export default function CategoriesTab({ categories = [], isLoadingCategories }) {
  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null); // null if adding
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("MapPin");

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      alert("Category created successfully!");
      closeModal();
    },
    onError: (err) => {
      alert(err.response?.data?.message || "Failed to create category.");
    }
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      alert("Category updated successfully!");
      closeModal();
    },
    onError: (err) => {
      alert(err.response?.data?.message || "Failed to update category.");
    }
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      alert("Category deleted successfully!");
    },
    onError: (err) => {
      alert(err.response?.data?.message || "Failed to delete category.");
    }
  });

  const openAddModal = () => {
    setEditingCategory(null);
    setName("");
    setSelectedIcon("MapPin");
    setModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSelectedIcon(cat.iconName || "MapPin");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCategory(null);
    setName("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload = {
      name: name.trim(),
      iconName: selectedIcon
    };

    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory._id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDeleteClick = (id, name) => {
    if (window.confirm(`Are you sure you want to delete category "${name}"? Locations mapped to this category may no longer filter correctly.`)) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-[20px] font-semibold text-foreground tracking-tight">
            Category Management
          </h2>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            Add, delete, or rename category selectors and assign layout icons.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="h-10 px-4 bg-primary text-white text-[13px] font-medium rounded-xl flex items-center gap-2 hover:bg-primary/95 transition-colors cursor-pointer shadow-sm focus:outline-none shrink-0"
        >
          <Plus size={16} />
          <span>Add Category</span>
        </button>
      </div>

      {/* Database Table list */}
      <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
        {isLoadingCategories ? (
          <div className="py-12 flex justify-center">
            <Loader2 className="animate-spin text-primary" size={28} />
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="px-6 py-3.5 w-16">Icon</th>
                <th className="px-6 py-3.5">Category Name</th>
                <th className="px-6 py-3.5">Icon Class Name</th>
                <th className="px-6 py-3.5 w-32 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-[13px]">
              {categories.length > 0 ? (
                categories.map((cat) => {
                  const IconComp = AVAILABLE_ICONS[cat.iconName] || MapPin;

                  return (
                    <tr key={cat._id} className="hover:bg-muted/10 transition-colors">
                      {/* Icon */}
                      <td className="px-6 py-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                          <IconComp size={18} />
                        </div>
                      </td>

                      {/* Name */}
                      <td className="px-6 py-3 font-semibold text-foreground">{cat.name}</td>

                      {/* Icon Name */}
                      <td className="px-6 py-3 text-muted-foreground font-mono text-[12px]">
                        {cat.iconName || "MapPin"}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(cat)}
                            className="p-1.5 rounded-lg border border-border text-foreground hover:bg-muted focus:outline-none"
                            title="Rename Category"
                          >
                            <Edit size={13} />
                          </button>
                          
                          <button
                            onClick={() => handleDeleteClick(cat._id, cat.name)}
                            className="p-1.5 rounded-lg border border-border text-red-600 hover:bg-red-50 focus:outline-none"
                            title="Delete Category"
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
                  <td colSpan="4" className="p-8 text-center text-muted-foreground">
                    No categories seeded or created.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Add / Edit Category Dialog Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white border border-border w-full max-w-md rounded-2xl shadow-xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground text-[15px]">
                {editingCategory ? "Edit Category" : "Create Category"}
              </h3>
              <button
                onClick={closeModal}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground focus:outline-none"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider block">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Student Canteens"
                    className="w-full h-11 px-4 rounded-xl border border-border text-[13px] font-medium bg-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                {/* Icon Grid Selector */}
                <div className="space-y-2">
                  <label className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider block">
                    Choose Map Icon
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {Object.keys(AVAILABLE_ICONS).map((iconKey) => {
                      const IconItem = AVAILABLE_ICONS[iconKey];
                      const isSelected = selectedIcon === iconKey;

                      return (
                        <button
                          key={iconKey}
                          type="button"
                          onClick={() => setSelectedIcon(iconKey)}
                          className={cn(
                            "h-11 rounded-lg border flex items-center justify-center text-muted-foreground hover:bg-muted/50 cursor-pointer focus:outline-none",
                            isSelected
                              ? "border-primary text-primary bg-primary/5 ring-1 ring-primary"
                              : "border-border text-foreground"
                          )}
                          title={iconKey}
                        >
                          <IconItem size={18} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Footer buttons */}
              <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-2 bg-muted/20">
                <button
                  type="button"
                  onClick={closeModal}
                  className="h-10 px-4 text-muted-foreground hover:text-foreground text-[13px] font-medium transition-colors focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="h-10 px-5 bg-primary text-white text-[13px] font-semibold rounded-xl hover:bg-primary/95 flex items-center gap-1.5 focus:outline-none cursor-pointer"
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 size={14} className="animate-spin" />
                  )}
                  <span>{editingCategory ? "Save Changes" : "Create"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
