export interface IProductFilterRequest {
  name?: string | undefined;
  description?: string | undefined;
  minPrice?: string | undefined;
  maxPrice?: string | undefined;
  category?: string | undefined;
  searchTerm?: string | undefined;
}
