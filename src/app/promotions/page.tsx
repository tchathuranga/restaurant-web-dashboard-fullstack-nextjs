"use client"

import SectionHeader from "@/component/common/SectionHeader";
// import ImageUploadBox from "@/component/common/ImageUploadBox";
import ImageUploadBoxPromotions from "@/component/promotions/ImageUploadBoxGalleryPromotions";
import ContainerBox from "@/component/common/ContainerBox";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { ApiResponse, deletePromotion, getAllPromotions } from "@/services/promotionsService";
import { PromotionProps } from "@/interfaces/promotions";
import { useEffect, useState } from "react";

export default function Promotions() {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [ImageData, setImageData] = useState<PromotionProps[]>([]);
  
    useEffect(() => {
      const fetchImages = async () => {
        setLoading(true);
        setError("");
        const response = await getAllPromotions();
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
      const response: ApiResponse<PromotionProps> = await deletePromotion(id);
      if (response.success) {
        alert("Image deleted successfully");
        window.location.reload();
      } else {
        alert("Failed to delete vacancy: " + response.error);
      }
    };
  
  return (
    <div className="margin p-10">
      <SectionHeader
        title="Promotions"
      />

      <ImageUploadBoxPromotions />

      <ContainerBox>
        {loading && <p className="p-4">Loading images...</p>}
        {error && (
          <p className="p-4 text-red-500">Error Loading Images: {error}</p>
        )}
        <div className="px-4">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Uploaded images</h2>
          <div className="grid grid-cols-1 gap-4">
            {ImageData.map((i, index) => (
              <div key={index}>
                <div
                  className="rounded-lg overflow-hidden aspect-video"
                >
                  <img
                    src={i.image}
                    alt={i.image}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4 flex flex-col items-center">
                  <div className="flex gap-4 mb-3">
                    <button onClick={() => i._id && handleDelete(i._id)} className="w-10 h-10 rounded-full bg-red-700 flex items-center justify-center hover:bg-red-400 transition-colors">
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