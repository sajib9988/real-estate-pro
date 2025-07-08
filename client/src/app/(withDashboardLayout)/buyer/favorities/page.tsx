'use client';

import { useUser } from "@/context/UserContext";
import { Property } from "@/lib/type";

import { getFavoriteProperties } from "@/service/favourites";
import Link from "next/link";
import { useEffect, useState } from "react";

// ✅ Type should be outside the component
interface Favorite {
  id: number;
  property: Property;
}

const FavouritePage = () => {
  const [response, setResponse] = useState<Favorite[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return; // ✅ Don't fetch if user is not logged in

      try {
        const data = await getFavoriteProperties();
        setResponse(data);
        console.log("Fetched favorite properties:", data);
      } catch (err) {
        setError("Failed to fetch favorites");
        console.error("Error fetching favorites:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">My Favorites</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div>
          {response && response.length > 0 ? (
            response.map((fav) => (
              <div key={fav.id} className="mb-4 p-4 border rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold">{fav.property.title}</h2>
                <p className="text-sm text-gray-600">{fav.property.location}</p>
                <p className="text-sm text-gray-800 font-medium">
                  ৳ {fav.property.price.toLocaleString()}
                </p>
                <Link href={`/properties/${fav.property.id}`} className="text-blue-500 hover:underline">
                  View Property Details
                </Link>
              </div>
            ))
          ) : (
            <p>No favorite properties found.</p>
          )}
        </div>
      )}

     
    </div>
  );
};

export default FavouritePage;
