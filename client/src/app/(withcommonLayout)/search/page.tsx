// app/search/page.tsx

import { getProperties } from "@/service/properties";
import { type Property } from "@/lib/type";
import { PropertyCard } from "@/homesection/PropertyCard";

interface SearchPageProps {
  searchParams: { search?: string };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const properties: Property[] = await getProperties(searchParams);

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Search Results</h1>
      {properties.length === 0 ? (
        <p className="text-gray-500">No results found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
                 
            />
          ))}
        </div>
      )}
    </div>
  );
}
