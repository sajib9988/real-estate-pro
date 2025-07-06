/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { UpdateRealEstateForm } from '@/form/UpdateRealEstateForm'; // Assuming this path

import { Property } from '@/lib/type';

interface PropertyTableProps {
  data: Property[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, updatedData: any) => void; // You might want to define a more specific type for updatedData
}

export function PropertyTable({ data, onDelete, onUpdate }: PropertyTableProps) {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

  const handleUpdateClick = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    setIsUpdateModalOpen(true);
  };

  const handleDeleteClick = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedPropertyId) {
      onDelete(selectedPropertyId);
      setIsDeleteModalOpen(false);
      setSelectedPropertyId(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full bg-white border border-gray-200">
        <TableHeader>
          <TableRow>
            <TableHead className="py-2 px-4 border-b">Title</TableHead>
            <TableHead className="py-2 px-4 border-b">Price</TableHead>
            <TableHead className="py-2 px-4 border-b">Location</TableHead>
            <TableHead className="py-2 px-4 border-b">Bedrooms</TableHead>
            <TableHead className="py-2 px-4 border-b">Bathrooms</TableHead>
            <TableHead className="py-2 px-4 border-b">Space</TableHead>
            <TableHead className="py-2 px-4 border-b">Type</TableHead>
            <TableHead className="py-2 px-4 border-b">Purpose</TableHead>
            <TableHead className="py-2 px-4 border-b">Published</TableHead>
            <TableHead className="py-2 px-4 border-b text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((property) => (
            <TableRow key={property.id}>
              <TableCell className="py-2 px-4 border-b">{property.title}</TableCell>
              <TableCell className="py-2 px-4 border-b">${property.price}</TableCell>
              <TableCell className="py-2 px-4 border-b">{property.location}</TableCell>
              <TableCell className="py-2 px-4 border-b">{property.bedrooms}</TableCell>
              <TableCell className="py-2 px-4 border-b">{property.bathrooms}</TableCell>
              <TableCell className="py-2 px-4 border-b">{property.space} sqft</TableCell>
              <TableCell className="py-2 px-4 border-b">{property.property_type}</TableCell>
              <TableCell className="py-2 px-4 border-b">{property.purpose}</TableCell>
              <TableCell className="py-2 px-4 border-b">{property.is_published ? 'Yes' : 'No'}</TableCell>
              <TableCell className="py-2 px-4 border-b text-right space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleUpdateClick(property.id)}>
                  Update
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(property.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Update Modal */}
      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update Property</DialogTitle>
            <DialogDescription>
              Make changes to your property here. Click save when you are done.
            </DialogDescription>
          </DialogHeader>
          {selectedPropertyId && (
            <UpdateRealEstateForm
              propertyId={selectedPropertyId}
              onUpdate={onUpdate}
              // You might need to pass a callback to handle form submission within the modal
              // For example: onSubmitSuccess={() => setIsUpdateModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your property
              and remove its data from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
