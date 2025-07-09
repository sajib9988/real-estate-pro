export interface DecodedUser {
  email: string;
  userId: string;
  role: string; // Assuming a role field in your JWT payload
  // Add other fields that are present in your decoded JWT
  exp: number; // Expiration time
  iat: number; // Issued at time
}

export type Property ={
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  description: string;
 space: number; // Assuming space is the area in sqft
  property_type: string;
  purpose: string; // e.g., "For Sale" or "For Rent"
  is_published: boolean;
  images: { image: string }[]; // Assuming images is an array of objects with
  // Add other fields that are part of your Property object
}


export interface PropertyFilterParams {
  search?: string;
  location?: string;
  min_price?: number;
  max_price?: number;
  purpose?: string;
  status?: string;
  bedrooms?: string;
  bathrooms?: string;
  property_type?: string;
}