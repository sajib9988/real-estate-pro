'use client';

import { FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { addFavorites } from "@/service/favourites";

const AddFavourite = () => {
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const propertyId = formData.get("propertyId");
    const userId = formData.get("userId");

    if (!propertyId || !userId) {
      toast.error("Please fill in both fields.");
      return;
    }

    try {
      const res = await addFavorites(formData);

      if (!res.ok) {
        throw new Error("Failed to add to favourites");
      }

      toast.success("Added to favourites!");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-10 shadow-md">
      <CardContent className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Add to Favourites</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="propertyId">Property ID</Label>
            <Input id="propertyId" name="propertyId" placeholder="Enter Property ID" required />
          </div>
          <div>
            <Label htmlFor="userId">User ID</Label>
            <Input id="userId" name="userId" placeholder="Enter User ID" required />
          </div>
          <Button type="submit" className="w-full">
            Add to Favourites
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddFavourite;
