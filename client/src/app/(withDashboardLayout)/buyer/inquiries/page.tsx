'use client';

import { useUser } from "@/context/UserContext";
import { getInquiries } from "@/service/inquiries";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Inquiry {
  id: number;
  property: {
    id: string;
    title: string;
    location: string;
  };
  message: string;
  contact_number: string;
  created_at: string;
}

const BuyerInquiriesPage = () => {
  const [inquiries, setInquiries] = useState<Inquiry[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return; // Don't fetch if user is not logged in

      try {
        const data = await getInquiries();
        setInquiries(data);
        console.log("Fetched inquiries:", data);
      } catch (err) {
        setError("Failed to fetch inquiries");
        console.error("Error fetching inquiries:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">My Inquiries</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div>
          {inquiries && inquiries.length > 0 ? (
            inquiries.map((inquiry) => (
              <div key={inquiry.id} className="mb-4 p-4 border rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold">Property: {inquiry.property.title}</h2>
                <p className="text-sm text-gray-600">Location: {inquiry.property.location}</p>
                <p className="text-sm text-gray-800 font-medium">Message: {inquiry.message}</p>
                <p className="text-sm text-gray-800 font-medium">Contact: {inquiry.contact_number}</p>
                <p className="text-xs text-gray-500">Sent on: {new Date(inquiry.created_at).toLocaleDateString()}</p>
                <Link href={`/properties/${inquiry.property.id}`} className="text-blue-500 hover:underline mt-2 block">
                  View Property
                </Link>
              </div>
            ))
          ) : (
            <p>No inquiries found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default BuyerInquiriesPage;
