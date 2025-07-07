/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

// React and Next.js imports
import { useState, useEffect } from 'react'

// Component imports from shadcn/ui
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'


// Library imports
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

// Service/API call import
import { getSingleProperty } from '@/service/properties'
import Image from 'next/image'

// Form validation schema
const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.coerce.number().min(1, 'Price is required'),
  location: z.string().min(1, 'Location is required'),
  bedrooms: z.coerce.number().min(1, 'Bedrooms must be at least 1'),
  bathrooms: z.coerce.number().min(1, 'Bathrooms must be at least 1'),
  space: z.coerce.number().min(1, 'Space must be at least 1 sqft'),
  property_type: z.string().min(1, 'Property type is required'),
  purpose: z.string().min(1, 'Purpose is required'),
  status: z.string().min(1, 'Status is required')
})

type FormValues = z.infer<typeof formSchema>

interface UpdateRealEstateFormProps {
  propertyId: string;
  onUpdate: (id: string, data: any) => void;
}

export function UpdateRealEstateForm({ propertyId, onUpdate }: UpdateRealEstateFormProps) {
  const [images, setImages] = useState<File[]>([])
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      location: '',
      bedrooms: 1,
      bathrooms: 1,
      space: 1000,
      property_type: '',
      purpose: 'For Sale',
      status: 'Pending'
    }
  })

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const property = await getSingleProperty(propertyId);
        form.reset({
          title: property.title,
          description: property.description,
          price: property.price,
          location: property.location,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          space: property.space,
          property_type: property.property_type,
          purpose: property.purpose,
          status: property.status
        });
        setExistingImageUrls(property.images.map((img: any) => img.image));
      } catch (error) {
        console.error("Failed to fetch property:", error);
        toast.error("Failed to load property data.");
      }
    };

    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId, form]);

  const onSubmit = async (data: FormValues) => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        if (images.length === 0 && existingImageUrls.length === 0) {
          throw new Error('Please upload at least one image.');
        }

        const formData = new FormData();
        const propertyData = {
          title: data.title,
          description: data.description,
          price: data.price,
          location: data.location,
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
          space: data.space,
          property_type: data.property_type,
          purpose: data.purpose,
          status: data.status,
          existingImages: existingImageUrls
        };
        
        for (const key in propertyData) {
          formData.append(key, (propertyData as any)[key]);
        }
        
        images.forEach((file) => {
          formData.append('images', file);
        });
        
        await onUpdate(propertyId, formData);
        
        form.reset();
        setImages([]);
        resolve(true);

      } catch (error: any) {
        console.error("Failed to update property:", error);
        reject(error);
      }
    });

    toast.promise(promise, {
        loading: 'Updating property...',
        success: (data) => {
            console.log('Successfully updated property:', data);
            return 'Property updated successfully!';
        },
        error: (error) => `Failed to update property: ${error.message || 'An unknown error occurred.'}`,
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Modern Apartment in Downtown" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Detailed property description" {...field} rows={6} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price ($)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter price" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Dhaka, Bangladesh" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="bedrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bedrooms</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bathrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bathrooms</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="space"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Space (sqft)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="property_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Type</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Apartment, House, Villa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="purpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purpose</FormLabel>
                  <FormControl>
                    <select {...field} className="w-full p-2 border rounded-md h-10">
                      <option value="For Sale">For Sale</option>
                      <option value="For Rent">For Rent</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

      <FormField
  control={form.control}
  name="status"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Status</FormLabel>
      <FormControl>
        <select {...field} className="w-full p-2 border rounded-md h-10">
          <option value="" disabled>Select status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

          
          </div>
        </div>

        <div className="space-y-4 rounded-lg border p-4 shadow-sm">
          <Label className="text-base font-medium">Property Images</Label>
          
          {/* Image Preview Grid - only shows if images exist */}
          {(images.length > 0 || existingImageUrls.length > 0) && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {existingImageUrls.map((url, index) => (
                <div key={`existing-${index}`} className="relative group">
                  <Image 
                    src={url} 
                    alt={`Existing Image ${index + 1}`} 
                    width={70} 
                    height={70}
                    className="w-full h-28 object-cover rounded-md" 
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() =>
                      setExistingImageUrls((prev) => prev.filter((_, i) => i !== index))
                    }
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" x2="6" y1="6" y2="18"></line>
                      <line x1="6" x2="18" y1="6" y2="18"></line>
                    </svg>
                  </Button>
                </div>
              ))}
              {images.map((img, index) => (
                <div key={`new-${index}`} className="relative group">
                  <Image 
                    src={URL.createObjectURL(img)} 
                    alt={img.name} 
                    width={70} 
                    height={70}
                    className="w-full h-28 object-cover rounded-md" 
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() =>
                      setImages((prev) => prev.filter((_, i) => i !== index))
                    }
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" x2="6" y1="6" y2="18"></line>
                      <line x1="6" x2="18" y1="6" y2="18"></line>
                    </svg>
                  </Button>
                </div>
              ))}
            </div>
          )}
          
          {/* Custom File Upload Button Area */}
          <div className="flex justify-center items-center w-full pt-2">
            <Label 
              htmlFor="file-upload" 
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 cursor-pointer"
            >
              Choose Files
            </Label>
            <Input
              id="file-upload"
              type="file"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files) {
                  const newFiles = Array.from(e.target.files);
                  setImages((prevImages) => [...prevImages, ...newFiles]);
                  e.target.value = '';
                }
              }}
            />
          </div>

          <p className="text-xs text-center text-gray-500">
            You can add multiple images.
          </p>
        </div>

        <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700 py-3 text-lg font-semibold">
          Update Property
        </Button>
      </form>
    </Form>
  )
}