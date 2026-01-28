"use client";

import ContainerBox from "@/component/common/ContainerBox";
import SectionHeader from "@/component/common/SectionHeader";
import ImageUploadBoxGallery from "@/component/gallery/ImageUploadBoxGallery";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useEffect, useState } from "react";
import {
  ApiResponse,
  deleteGalleryItem,
  getAllGalleryItems,
} from "@/services/gallaryService";
import { IGallery } from "@/interfaces/gallery";

export default function Gallery() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [ImageData, setImageData] = useState<IGallery[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      setError("");
      const response = await getAllGalleryItems();
      console.log("Gallery fetch response:", response);
      if (response.success && response.data) {
        setImageData(response.data);
      } else {
        setError(response.error || "Failed to load gallery items");
      }
      setLoading(false);
    };

    fetchImages();
  }, []);

  const handleDelete = async (id: string) => {
    const response: ApiResponse<IGallery> = await deleteGalleryItem(id);
    if (response.success) {
      alert("Image deleted successfully");
      window.location.reload();
    } else {
      alert("Failed to delete vacancy: " + response.error);
    }
  };

  return (
    <div className="margin p-10">
      <SectionHeader title="Gallery" />

      <ImageUploadBoxGallery />

      <ContainerBox>
        {loading && <p className="p-4">Loading images...</p>}
        {error && (
          <p className="p-4 text-red-500">Error Loading Images: {error}</p>
        )}
        <div className="px-4">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Uploaded images
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {ImageData.map((i, index) => (
              <div key={index}>
                <div className="rounded-lg overflow-hidden aspect-video">
                  <img
                    src={i.image}
                    alt={"image_" + i.image}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4 flex flex-col items-center">
                  <div className="flex gap-4 mb-3">
                    <button
                      onClick={() => i._id && handleDelete(i._id)}
                      className="w-10 h-10 rounded-full bg-red-700 flex items-center justify-center hover:bg-red-400 transition-colors"
                    >
                      <DeleteOutlineIcon style={{ color: "white" }} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ContainerBox>
    </div>
  );
}
