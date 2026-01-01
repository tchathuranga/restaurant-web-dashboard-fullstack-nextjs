"use client"

import { SectionHeader } from "@/component/common/SectionHeader";
import ImageUploadBox from "@/component/common/ImageUploadBox";
import ContainerBox from "@/component/common/ContainerBox";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export default function Promotions() {

  const uploadedImages = [
    { id: 1, url: "https://images.pexels.com/photos/26605441/pexels-photo-26605441/free-photo-of-indian-food-in-a-bowl.jpeg", alt: "Gallery image 1" },
    { id: 2, url: "https://images.pexels.com/photos/26605441/pexels-photo-26605441/free-photo-of-indian-food-in-a-bowl.jpeg", alt: "Gallery image 2" },
    { id: 3, url: "https://images.pexels.com/photos/26605441/pexels-photo-26605441/free-photo-of-indian-food-in-a-bowl.jpeg", alt: "Gallery image 3" },
    { id: 4, url: "https://images.pexels.com/photos/26605441/pexels-photo-26605441/free-photo-of-indian-food-in-a-bowl.jpeg", alt: "Gallery image 4" },
    { id: 5, url: "https://images.pexels.com/photos/26605441/pexels-photo-26605441/free-photo-of-indian-food-in-a-bowl.jpeg", alt: "Gallery image 5" },
    { id: 6, url: "https://images.pexels.com/photos/26605441/pexels-photo-26605441/free-photo-of-indian-food-in-a-bowl.jpeg", alt: "Gallery image 6" },
  ];
  
  return (
    <div className="margin p-10">
      <SectionHeader
        title="Promotions"
        subtitle="Hi, Samantha. Welcome to Sri Vihar Admin!"
      />

      <ImageUploadBox />

      <ContainerBox>
        <div className="px-4">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Uploaded images</h2>
          <div className="grid grid-cols-1 gap-4">
            {uploadedImages.map((image) => (
              <div key={image.id}>
                <div
                  className="rounded-lg overflow-hidden aspect-video"
                >
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4 flex flex-col items-center">
                  <div className="flex gap-4 mb-3">
                    <button className="w-10 h-10 rounded-full bg-red-700 flex items-center justify-center hover:bg-red-400 transition-colors">
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