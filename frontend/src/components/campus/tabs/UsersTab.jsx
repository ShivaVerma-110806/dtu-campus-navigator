import React, { useState, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateUserRole,
  updateUserStatus,
  deleteUser
} from "../../../services/authService";
import {
  Search,
  UserCheck,
  Shield,
  Ban,
  Trash2,
  Loader2
} from "lucide-react";
import { cn } from "../../../lib/utils";

export default function UsersTab({ users = [], isLoadingUsers, currentUser }) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  // Role Mutation
  const roleMutation = useMutation({
    mutationFn: ({ id, role }) => updateUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      alert("User role updated successfully!");
    },
    onError: (err) => {
      alert(err.response?.data?.message || "Failed to change user role.");
    }
  });

  // Status/Suspension Mutation
  const statusMutation = useMutation({
    mutationFn: ({ id, isSuspended }) => updateUserStatus(id, isSuspended),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      alert("User status updated successfully!");
    },
    onError: (err) => {
      alert(err.response?.data?.message || "Failed to change user status.");
    }
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      alert("User account deleted successfully!");
    },
    onError: (err) => {
      alert(err.response?.data?.message || "Failed to delete user account.");
    }
  });

  // Handle updates
  const handleToggleRole = (id, currentRole) => {
    if (id === currentUser.id) {
      alert("You cannot modify your own administrative role!");
      return;
    }
    const newRole = currentRole === "admin" ? "student" : "admin";
    if (window.confirm(`Are you sure you want to change this user's role to "${newRole}"?`)) {
      roleMutation.mutate({ id, role: newRole });
    }
  };

  const handleToggleSuspension = (id, currentSuspension, name) => {
    if (id === currentUser.id) {
      alert("You cannot suspend your own administrative session!");
      return;
    }
    const nextState = !currentSuspension;
    const confirmMsg = nextState
      ? `Are you sure you want to SUSPEND "${name}"? They will be locked out of the application.`
      : `Are you sure you want to UNSUSPEND "${name}"?`;

    if (window.confirm(confirmMsg)) {
      statusMutation.mutate({ id, isSuspended: nextState });
    }
  };

  const handleDeleteClick = (id, name) => {
    if (id === currentUser.id) {
      alert("You cannot delete your own administrative account!");
      return;
    }
    if (window.confirm(`Are you sure you want to permanently delete user account "${name}"? This action cannot be undone.`)) {
      deleteMutation.mutate(id);
    }
  };

  // Filter list
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = search.toLowerCase().trim();
      return (
        !q ||
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.role?.toLowerCase().includes(q)
      );
    });
  }, [users, search]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title */}
      <div>
        <h2 className="text-[20px] font-semibold text-foreground tracking-tight">
          User Management
        </h2>
        <p className="text-[13px] text-muted-foreground mt-0.5">
          Modify permissions, toggle access roles, or suspend registered navigator users.
        </p>
      </div>

      {/* Search Input */}
      <div className="bg-white border border-border p-4 rounded-2xl shadow-sm">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search users by name, email, or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-border text-[13px] font-medium bg-white focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Table list */}
      <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
        {isLoadingUsers ? (
          <div className="py-12 flex justify-center">
            <Loader2 className="animate-spin text-primary" size={28} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-muted/30 border-b border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="px-6 py-3.5">User</th>
                  <th className="px-6 py-3.5">Email Address</th>
                  <th className="px-6 py-3.5 w-28">Role</th>
                  <th className="px-6 py-3.5 w-32">Joined Date</th>
                  <th className="px-6 py-3.5 w-28">Status</th>
                  <th className="px-6 py-3.5 text-right w-44">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-[13px]">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((u) => {
                    const isSelf = u._id === currentUser.id;
                    const date = u.createdAt
                      ? new Date(u.createdAt).toLocaleDateString()
                      : "N/A";
                    const isSuspended = !!u.isSuspended;

                    return (
                      <tr key={u._id} className="hover:bg-muted/10 transition-colors">
                        {/* Name & Avatar */}
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase shrink-0">
                              {u.name?.slice(0, 1)}
                            </div>
                            <div className="min-w-0">
                              <span className="font-semibold text-foreground truncate block">
                                {u.name}
                              </span>
                              {isSelf && (
                                <span className="text-[10px] text-primary font-semibold uppercase tracking-wider block mt-0.5">
                                  You
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-6 py-3 text-muted-foreground font-medium">{u.email}</td>

                        {/* Role */}
                        <td className="px-6 py-3">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider",
                              u.role === "admin"
                                ? "bg-primary/10 text-primary"
                                : "bg-muted text-muted-foreground"
                            )}
                          >
                            {u.role || "student"}
                          </span>
                        </td>

                        {/* Joined Date */}
                        <td className="px-6 py-3 text-muted-foreground">{date}</td>

                        {/* Status */}
                        <td className="px-6 py-3">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider",
                              isSuspended
                                ? "bg-red-50 text-red-700 border border-red-200"
                                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            )}
                          >
                            {isSuspended ? "Suspended" : "Active"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-3 text-right">
                          <div className="flex justify-end gap-1.5">
                            <button
                              disabled={isSelf}
                              onClick={() => handleToggleRole(u._id, u.role)}
                              className="p-1.5 rounded-lg border border-border text-foreground hover:bg-muted disabled:opacity-30 disabled:hover:bg-transparent focus:outline-none"
                              title="Toggle Role Permission"
                            >
                              <Shield size={13} />
                            </button>

                            <button
                              disabled={isSelf}
                              onClick={() => handleToggleSuspension(u._id, isSuspended, u.name)}
                              className={cn(
                                "p-1.5 rounded-lg border border-border focus:outline-none disabled:opacity-30 disabled:hover:bg-transparent",
                                isSuspended
                                  ? "text-emerald-600 hover:bg-emerald-50"
                                  : "text-amber-600 hover:bg-amber-50"
                              )}
                              title={isSuspended ? "Unsuspend User" : "Suspend User"}
                            >
                              <Ban size={13} />
                            </button>

                            <button
                              disabled={isSelf}
                              onClick={() => handleDeleteClick(u._id, u.name)}
                              className="p-1.5 rounded-lg border border-border text-red-600 hover:bg-red-50 disabled:opacity-30 disabled:hover:bg-transparent focus:outline-none"
                              title="Delete Account"
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
                    <td colSpan="6" className="p-8 text-center text-muted-foreground">
                      No matching user records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
