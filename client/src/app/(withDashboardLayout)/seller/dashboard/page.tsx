'use client'

import { PropertyTable } from "@/components/PropertyTable";
import { Property } from "@/lib/type";
import { deleteProperty, getPropertiesBySeller, updateProperties } from "@/service/properties";
import { useEffect, useState } from "react";

const SellerDashboardPage = () => {
  const [properties, setProperties] = useState<Property[]>([]);  // <-- typed state

  const fetchProperties = async () => {
    try {
      const response = await getPropertiesBySeller();
      setProperties(response as Property[]); 
      console.log("Fetched properties:", response);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteProperty(id);
      setProperties((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting property:", error);
    }
  };

  const handleUpdate = async (id: string, updatedData: FormData) => {
    try {
      await updateProperties(id, updatedData);
      fetchProperties(); // Re-fetch properties after successful update
    } catch (error) {
      console.error("Error updating property:", error);
    }
  };

  return (
    <div>
      <PropertyTable data={properties} onDelete={handleDelete} onUpdate={handleUpdate} />
    </div>
  );
};

export default SellerDashboardPage;
