"use client";

import PageShell from "@/components/common/PageShell";
import SectionHeader from "@/components/common/SectionHeader";
import ImageLibrary from "@/components/common/ImageLibrary";
import { createGalleryItem, deleteGalleryItem, getAllGalleryItems } from "@/services/galleryService";
import { uploadGalleryImageToCloudinary } from "@/services/uploadService";

export default function Gallery() {
  return (
    <PageShell>
      <SectionHeader title="Gallery" />
      <ImageLibrary
        noun="gallery image"
        shownOn="the Our Story page gallery"
        gridClassName="grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
        list={getAllGalleryItems}
        create={createGalleryItem}
        remove={deleteGalleryItem}
        upload={uploadGalleryImageToCloudinary}
      />
    </PageShell>
  );
}
