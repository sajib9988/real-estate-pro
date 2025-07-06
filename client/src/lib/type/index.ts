export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  space: number;
  property_type: string;
  purpose: string;
  is_published: boolean;
  images: { image: string }[];
}