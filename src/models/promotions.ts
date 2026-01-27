import mongoose from 'mongoose';
import { PromotionProps } from '@/interfaces/promotions';

const PromotionSchema = new mongoose.Schema<PromotionProps>(
    {
        image: { type: String, required: true },
    },
    { timestamps: true }
);

export default mongoose.models.Promotion || mongoose.model<PromotionProps>('Promotion', PromotionSchema);