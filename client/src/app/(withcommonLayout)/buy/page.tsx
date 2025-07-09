'use client';

import { Property } from "@/lib/type";
import { getProperties } from "@/service/properties";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const BuyHomePage = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchData = async () => {
    try {
      const data = await getProperties();
      setProperties(data);

      const filtered = data.filter(
        (property: Property) =>
          property.property_type === 'House' &&
          property.purpose === 'For Sale'
      );
      setFilteredProperties(filtered);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded-lg w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="h-48 bg-gray-300 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Find Your Dream <span className="text-blue-600">Home</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover beautiful houses in prime locations. Your perfect home is just a click away.
          </p>
          <div className="flex justify-center mt-6">
            <div className="bg-white rounded-full px-6 py-3 shadow-lg">
              <span className="text-blue-600 font-semibold">
                {filteredProperties.length} Houses Available
              </span>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <div 
                key={property.id} 
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group"
              >
                {/* Property Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image 
                    src={property.images?.[0]?.image || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop'}
                    alt={property.title}
                    width={600}
                    height={400}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent group-hover:from-black/20 transition-all duration-300"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white bg-opacity-90 rounded-lg px-3 py-1 inline-block">
                      <span className="text-sm font-semibold text-gray-800">
                        {property.property_type}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Property Details */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                    {property.title}
                  </h2>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {property.description}
                  </p>

                  {/* Property Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {property.bedrooms && (
                      <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {property.bedrooms} Bed
                      </div>
                    )}
                    {property.bathrooms && (
                      <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                        {property.bathrooms} Bath
                      </div>
                    )}
                    {property.area && (
                      <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                        {property.area} sqft
                      </div>
                    )}
                  </div>

                  {/* Price and Action */}
                  <div className="flex justify-between items-center">
                    <div>
                      {property.price && (
                        <span className="text-2xl font-bold text-blue-600">
                          ${property.price.toLocaleString()}
                        </span>
                      )}
                      {property.location && (
                        <p className="text-sm text-gray-500 mt-1">
                          📍 {property.location}
                        </p>
                      )}
                    </div>
                    <Link
                      href={`/property/${property.id}`}
                     className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-semibold">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
              <div className="text-6xl mb-4">🏠</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No Houses Found
              </h3>
              <p className="text-gray-600">
                We couldnot find any houses matching your criteria. Please try again later.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyHomePage;