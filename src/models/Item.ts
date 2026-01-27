import mongoose from 'mongoose';
import { IItem } from '@/interfaces/Items';

const ItemSchema = new mongoose.Schema<IItem>(
  {
    image: {
      type: String,
      required: [true, 'Please provide an image URL'],
    },
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      optional: true,
    },
    price: {
      type: String,
      optional: true,
    },
    imageAlt: {
      type: String,
      optional: true,
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: [
        'Cafe Items',
        'North Indian',
        'South Indian',
        'Cakes',
        'Ice Cream',
        'Chaat Items',
        'Juices',
        'Sweets',
      ],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Item || mongoose.model<IItem>('Item', ItemSchema);
