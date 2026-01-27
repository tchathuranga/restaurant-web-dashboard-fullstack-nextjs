// Single Item interface used across the application
export interface IItem {
  _id?: string;
  image: string;
  title: string;
  description?: string;
  price?: string;
  imageAlt?: string ;
  category: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Grouped data structure for displaying items by category
export interface ItemData {
  Category: string;
  data: IItem[];
}