'use client'

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

import { useForm } from 'react-hook-form'
import { useState } from 'react'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { addProperties } from '@/service/properties'
import { Switch } from '@radix-ui/react-switch'

// ✅ Form validation schema
const formSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.string().min(1),
  location: z.string().min(1),
  bedrooms: z.coerce.number().min(1),
  bathrooms: z.coerce.number().min(1),
  space: z.coerce.number().min(1),
  property_type: z.string().min(1),
  purpose: z.string().min(1),
  is_published: z.boolean(),
  // images are handled outside form object
})

type FormValues = z.infer<typeof formSchema>

export function RealEstateForm() {
  const [images, setImages] = useState<File[]>([])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      price: '',
      location: '',
      bedrooms: 1,
      bathrooms: 1,
      space: 0,
      property_type: '',
      purpose: 'for_sale',
      is_published: true
    }
  })

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData()
    // Fixed: Remove duplicate variable declaration
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
      is_published: data.is_published
    }
    formData.append('propertyData', JSON.stringify(propertyData))
    images.forEach((file) => {
      formData.append('images', file)
    })

    const res = await addProperties(formData)

    if (res.ok) {
      alert('Property created!')
    } else {
      alert('Something went wrong')
    }
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
                    <Input placeholder="Property title" {...field} />
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
                    <Textarea placeholder="Property description" {...field} />
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
                  <FormLabel>Price</FormLabel>
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
                    <Input placeholder="Enter location" {...field} />
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
                    <Input placeholder="e.g. Apartment" {...field} />
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
                    <select {...field} className="w-full p-2 border rounded">
                      <option value="for_sale">For Sale</option>
                      <option value="for_rent">For Rent</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-6">
          <FormField
            control={form.control}
            name="is_published"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Published</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <Label>Images</Label>
            {images.map((img, index) => (
              <div key={index} className="flex items-center gap-2">
                <p className="text-sm">{img.name}</p>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() =>
                    setImages((prev) => prev.filter((_, i) => i !== index))
                  }
                >
                  Remove
                </Button>
              </div>
            ))}
            <Input
              type="file"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setImages((prev) => [...prev, e.target.files![0]])
                }
              }}
            />
          </div>
        </div>

        <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700">
          Submit
        </Button>
      </form>
    </Form>
  )
}