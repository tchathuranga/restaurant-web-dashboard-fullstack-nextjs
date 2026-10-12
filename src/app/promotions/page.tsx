"use client"

import PageShell from "@/component/common/PageShell";
import SectionHeader from "@/component/common/SectionHeader";
import ImageLibrary from "@/component/common/ImageLibrary";
import { createPromotion, deletePromotion, getAllPromotions } from "@/services/promotionsService";
import { uploadPromotionsImageToCloudinary } from "@/services/uploadService";

export default function Promotions() {
  return (
    <PageShell>
      <SectionHeader title="Promotions" />
      <ImageLibrary
        noun="promotion"
        shownOn="the promotions section of the home page"
        gridClassName="grid-cols-1 lg:grid-cols-2"
        list={getAllPromotions}
        create={createPromotion}
        remove={deletePromotion}
        upload={uploadPromotionsImageToCloudinary}
      />
    </PageShell>
  );
}
