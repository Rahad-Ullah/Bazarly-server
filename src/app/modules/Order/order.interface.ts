export interface IOrderFilterRequest {
  status?: string | undefined;
  paymentType?: string | undefined;
  paymentStatus?: string | undefined;
  name?: string | undefined;
  phoneNumber?: string | undefined;
  email?: string | undefined;
  shop?: string | undefined;
  searchTerm?: string | undefined;
}
