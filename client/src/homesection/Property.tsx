'use client'

import { getProperties } from "@/service/properties";
import { useEffect, useState } from "react";
import { PropertyCard } from "./PropertyCard";
import {type Property } from "@/lib/type";


const Property = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const mockData = await getProperties();
        setProperties(mockData);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties(); // Call the function
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Real Estate Properties
          </h1>
          <p className="text-lg text-gray-600">
            Find your dream property with our comprehensive listings
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {properties?.map((property) => (
              <PropertyCard
                key={property.id} 
                property={property} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Property;