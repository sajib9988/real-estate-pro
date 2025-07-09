'use client'

import { MapPin, Bed, Bath, Square, Heart, Share2 } from 'lucide-react';
import { type Property } from "@/lib/type";
import Image from 'next/image';
import Link from 'next/link';
import { addFavorites } from '@/service/favourites';
import { toast } from 'sonner';
import { useState } from 'react';

import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';

interface PropertyCardProps {
  property: Property;
  
}

export const PropertyCard = ({ property,  }: PropertyCardProps) => {
  const { user } = useUser();
const router = useRouter();

  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const formatPrice = (price: string | number) => {
    const numPrice = parseFloat(price.toString());
    if (numPrice >= 10000000) {
      return `${(numPrice / 10000000).toFixed(1)} Crore`;
    } else if (numPrice >= 100000) {
      return `${(numPrice / 100000).toFixed(1)} Lakh`;
    } else if (numPrice >= 1000) {
      return `${(numPrice / 1000).toFixed(0)}K`;
    }
    return numPrice.toLocaleString();
  };


 const addFavourites = async (propertyId: string) => {
  if (!user) {
    router.push('/login');
    return;
  }

  if (isLoading) return;
  setIsLoading(true);

  try {
    const data = await addFavorites(propertyId); // ✅ Direct await করো
    
    toast.success('Added to favorites successfully');
    setIsFavorited(true);
    console.log('Added to favorites:', data);
  } catch (error) {
    console.error('Error adding to favorites:', error);
    toast.error('Failed to add to favorites');
  } finally {
    setIsLoading(false);
  }
};
  return (
    <div className="max-w-sm mx-auto bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Image Section */}
      <div className="relative">
        <Image 
       src={property.images?.[0]?.image || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop'}

          alt={property.title}
            width={600}
            height={400}
          className="w-full h-48 object-cover"
        />
        
        {/* Overlay badges */}
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
            property.purpose === 'For Sale' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
          }`}>
            {property.purpose}
          </span>
        </div>
        
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 text-xs font-semibold bg-gray-900 text-white rounded-full">
            {property.property_type}
          </span>
        </div>

        {/* Action buttons */}
        <div className="absolute bottom-3 right-3 flex gap-2">
         <button 
  onClick={() => addFavourites(property.id)}
  disabled={isLoading}
  className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
>
  <Heart className={`w-4 h-4 ${isFavorited ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
</button>

          <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
            <Share2 className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Price */}
        <div className="mb-3">
          <span className="text-2xl font-bold text-gray-900">
            ৳{formatPrice(property.price)}
          </span>
          {property.purpose === 'For Rent' && (
            <span className="text-sm text-gray-500 ml-1">/month</span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{property.location}</span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {property.description}
        </p>

        {/* Property Details */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <Bed className="w-4 h-4 mr-1" />
            <span>{property.bedrooms} Bed</span>
          </div>
          <div className="flex items-center">
            <Bath className="w-4 h-4 mr-1" />
            <span>{property.bathrooms} Bath</span>
          </div>
          <div className="flex items-center">
            <Square className="w-4 h-4 mr-1" />
            <span>{property.space} sqft</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">

          <Link 
            href={`/properties/${propertyId}`}
        
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};