"use client";

import { useRef, useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { uploadGalleryImageToCloudinary } from "@/services/uploadService";
import { createGalleryItem } from "@/services/gallaryService";


const ImageUploadBoxGallery = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [postError, setPostError] = useState<string>("");

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setPostError("Please select an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setPostError("File size must be less than 5MB");
        return;
      }

      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      setPostError("");
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setPostError("Please select an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setPostError("File size must be less than 5MB");
        return;
      }

      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setPostError("");
    }
  };

  const saveImageToGallery = async (imageUrl: string) => {
    try {
      const result = await createGalleryItem({ image: imageUrl });
      if(result.success) {
        setSelectedFile(null);
        setImagePreview("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        window.location.reload();
      } else {
        setPostError(result.error || "Failed to save image to gallery");
      }
    } catch (error) {
      console.error("Error saving image to gallery:", error);
    }
  };

  const handleUpload = async () => {
    setUploading(true);
    if (!selectedFile) {
      setPostError("No file selected for upload");
      return;
    }

    const response = await uploadGalleryImageToCloudinary(selectedFile);
    console.log("Upload response:", response);

    if (response.success && response.url) {
      setUploading(false);
      setPostError("");
      saveImageToGallery(response.url);
    } else {
      setPostError(response.error || "Image upload failed");
    }
  };

  return (
    <div className="bg-white p-8 w-full mb-10 rounded-xl">
      {imagePreview ? (
        <div className="relative">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg"
          />
          <div className="flex justify-center mt-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setSelectedFile(null);
                setImagePreview("");
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
              className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
            >
              Remove
            </button>
            <button
              type="button"
              onClick={handleUpload}
              className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
            >
              Upload
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`
                bg-white rounded-lg border-2 border-dashed border-gray-300
                w-full p-12 flex flex-col items-center justify-center
                cursor-pointer transition-all min-h-75
                ${isDragging ? "border-blue-400 bg-blue-50/50" : "hover:border-gray-400"}
            `}
          onClick={handleBrowseClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="mb-6">
            <CloudUploadIcon
              sx={{
                fontSize: 64,
                color: "#2563eb",
              }}
            />
          </div>

          <h3 className="text-lg font-bold text-gray-800 mb-2">
            Browse Files to upload
          </h3>

          <p className="text-sm text-gray-500">Upload the image here</p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {uploading && (
        <div className="text-center py-4">
          <p className="text-gray-500">Uploading image...</p>
        </div>
      )}

      {postError && (
        <div className="text-center py-4 bg-red-50 rounded-lg">
          <p className="text-red-600">{postError}</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploadBoxGallery;