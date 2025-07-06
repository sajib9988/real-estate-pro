'use client';

import { useEffect, useState } from 'react';
import { PropertyTable } from '@/components/PropertyTable';
import { getProperties, deleteProperty } from '@/service/properties'; // Import your service functions
import { toast } from 'sonner';

import { Property } from '@/lib/type';

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const data = await getProperties(); // Fetch all properties
        setProperties(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || 'Failed to fetch properties');
          toast.error(err.message || 'Failed to fetch properties');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteProperty(id);
      setProperties(prev => prev.filter(p => p.id !== id));
      toast.success('Property deleted successfully!');
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || 'Failed to delete property');
      }
    }
  };

  const handleUpdate = async () => {
    try {
      // This function might need to be more complex depending on how your updateProperties works
      // For now, it's a placeholder. The UpdateRealEstateForm will handle the actual submission.
      // You might re-fetch properties or update state directly after a successful update.
      toast.success('Property update initiated. Form will handle submission.');
      // After the form in the modal submits, you'd likely want to re-fetch the data
      // or update the specific property in the `properties` state.
      // For example:
      // const updatedProperty = await updateProperties(id, updatedData);
      // setProperties(prev => prev.map(p => p.id === id ? updatedProperty : p));
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || 'Failed to update property');
      }
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading properties...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Manage Properties</h1>
      <PropertyTable data={properties} onDelete={handleDelete} onUpdate={handleUpdate} />
    </div>
  );
}
