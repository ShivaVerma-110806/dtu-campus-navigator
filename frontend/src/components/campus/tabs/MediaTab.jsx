import React, { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadMedia, deleteMedia } from "../../../services/locationService";
import {
  UploadCloud,
  FileImage,
  Copy,
  Trash2,
  Check,
  Eye,
  Loader2
} from "lucide-react";
import { cn } from "../../../lib/utils";

export default function MediaTab({ mediaList = [], isLoadingMedia }) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

  // Drag over states
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // 0 = inactive, 100 = complete
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Upload Mutation
  const uploadMutation = useMutation({
    mutationFn: uploadMedia,
    onSuccess: () => {
      queryClient.invalidateQueries(["media"]);
      setUploadProgress(100);
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 800);
    },
    onError: (err) => {
      alert(err.response?.data?.message || "Failed to upload file.");
      setIsUploading(false);
      setUploadProgress(0);
    }
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: deleteMedia,
    onSuccess: () => {
      queryClient.invalidateQueries(["media"]);
      alert("Image deleted successfully!");
    },
    onError: (err) => {
      alert(err.response?.data?.message || "Failed to delete image.");
    }
  });

  // Drag and Drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processUpload(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      processUpload(files[0]);
    }
  };

  const processUpload = (file) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload image files only (PNG, JPG, WEBP, etc.)");
      return;
    }

    setIsUploading(true);
    setUploadProgress(15);
    
    // Simulate upload progress
    const timer = setInterval(() => {
      setUploadProgress((old) => {
        if (old >= 85) {
          clearInterval(timer);
          return old;
        }
        return old + 12;
      });
    }, 150);

    uploadMutation.mutate(file);
  };

  // Copy Link
  const handleCopyLink = (id, url) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Delete Item Prompt
  const handleDeleteClick = (id, filename) => {
    if (window.confirm(`Are you sure you want to permanently delete "${filename}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title */}
      <div>
        <h2 className="text-[20px] font-semibold text-foreground tracking-tight">
          Media & Asset Manager
        </h2>
        <p className="text-[13px] text-muted-foreground mt-0.5">
          Upload and catalog cover screenshots or thumbnail assets.
        </p>
      </div>

      {/* Upload Block */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-muted/15 transition-all text-center select-none bg-white",
          isDragOver && "border-primary bg-primary/5",
          isUploading && "pointer-events-none opacity-80"
        )}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*"
          className="hidden"
        />

        {isUploading ? (
          <div className="w-full max-w-xs space-y-3">
            <Loader2 className="animate-spin text-primary mx-auto" size={32} />
            <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-[12px] font-semibold text-muted-foreground">
              Uploading asset... {uploadProgress}%
            </p>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <UploadCloud size={24} />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-foreground">
                Drag & drop files here, or click to browse
              </p>
              <p className="text-[12px] text-muted-foreground mt-1">
                Supports PNG, JPG, JPEG, WEBP up to 10MB
              </p>
            </div>
          </>
        )}
      </div>

      {/* Grid Library */}
      <div className="space-y-4">
        <h3 className="text-[14px] font-semibold text-foreground">Media Library</h3>

        {isLoadingMedia ? (
          <div className="py-12 flex justify-center">
            <Loader2 className="animate-spin text-primary" size={28} />
          </div>
        ) : mediaList.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {mediaList.map((item) => {
              const prettyName = item.filename.split("-").slice(1).join("-") || item.filename;
              const formattedSize = item.size ? `${(item.size / 1024).toFixed(1)} KB` : "";

              return (
                <div
                  key={item._id}
                  className="bg-white border border-border rounded-xl overflow-hidden shadow-sm flex flex-col group relative"
                >
                  {/* Thumbnail */}
                  <div className="aspect-square bg-muted relative overflow-hidden shrink-0 border-b border-border">
                    <img
                      src={item.url}
                      alt={item.filename}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />

                    {/* Actions Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity duration-150">
                      <button
                        onClick={() => setPreviewImage(item.url)}
                        className="w-8 h-8 rounded-full bg-white text-foreground flex items-center justify-center hover:bg-muted active:scale-95 transition-all focus:outline-none"
                        title="Preview"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => handleCopyLink(item._id, item.url)}
                        className="w-8 h-8 rounded-full bg-white text-foreground flex items-center justify-center hover:bg-muted active:scale-95 transition-all focus:outline-none"
                        title="Copy Image URL"
                      >
                        {copiedId === item._id ? (
                          <Check size={14} className="text-green-600" />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteClick(item._id, item.filename)}
                        className="w-8 h-8 rounded-full bg-white text-red-600 flex items-center justify-center hover:bg-red-50 active:scale-95 transition-all focus:outline-none"
                        title="Delete Asset"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Info Label */}
                  <div className="p-2.5 min-w-0">
                    <p className="text-[11px] font-semibold text-foreground truncate" title={prettyName}>
                      {prettyName}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                      {formattedSize}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 border border-dashed border-border rounded-2xl bg-white text-center text-muted-foreground text-[13px]">
            No media assets uploaded yet. Drag or drop images to seed the database.
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fadeIn">
          <div className="relative bg-white max-w-3xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-border">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 text-foreground hover:bg-white shadow-md flex items-center justify-center transition-colors focus:outline-none"
            >
              <X size={18} />
            </button>
            <img src={previewImage} alt="Preview" className="max-w-full max-h-[80vh] object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}

// X close helper icon
function X(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
      {...props}
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}
