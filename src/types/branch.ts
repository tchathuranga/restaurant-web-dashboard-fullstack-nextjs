export interface IBranch {
  _id?: string;
  name: string;
  address: string;
  hours: string;
  phone: string;
  uberUrl?: string;
  pickmeUrl?: string;
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
