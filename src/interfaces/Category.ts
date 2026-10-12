export interface ISubcategory {
  _id: string;
  name: string;
}

export interface ICategory {
  _id: string;
  name: string;
  subcategories: ISubcategory[];
}
