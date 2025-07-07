'use client'

import { useEffect, useState } from "react"
import { getProperties } from "@/service/properties/index"
import { type Property, type PropertyFilterParams } from "@/lib/type"
import PropertyMarquee from "./carosel/PropertyMarquee"

const defaultFilters: PropertyFilterParams = {
  location: '',
  bedrooms: '',
  bathrooms: '',
  property_type: '',
  purpose: ''
}

const Property = () => {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState<PropertyFilterParams>(defaultFilters)

  // 🔁 Fetch properties when filters change
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true)
      try {
        const data = await getProperties(filters)
        setProperties(data)
      } catch (error) {
        console.error("Error fetching properties:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [filters])

  // 🛠️ Handle input/select changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  // 🔄 Reset button click handler
  const handleReset = () => {
    setFilters(defaultFilters)
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Real Estate Properties
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Find your dream property with our comprehensive listings
          </p>

          {/* 🔍 Filter Section */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={filters.location}
              onChange={handleChange}
              className="p-2 border rounded-md w-full"
            />
            <input
              type="number"
              name="bedrooms"
              placeholder="Bedrooms"
              value={filters.bedrooms}
              onChange={handleChange}
              className="p-2 border rounded-md w-full"
            />
            <input
              type="number"
              name="bathrooms"
              placeholder="Bathrooms"
              value={filters.bathrooms}
              onChange={handleChange}
              className="p-2 border rounded-md w-full"
            />
            <select
              name="property_type"
              value={filters.property_type}
              onChange={handleChange}
              className="p-2 border rounded-md w-full"
            >
              <option value="">Property Type</option>
              <option value="Apartment">Apartment</option>
              <option value="Flat">Flat</option>
              <option value="House">House</option>
            </select>
            <select
              name="purpose"
              value={filters.purpose}
              onChange={handleChange}
              className="p-2 border rounded-md w-full"
            >
              <option value="">Purpose</option>
              <option value="For Sale">For Sale</option>
              <option value="For Rent">For Rent</option>
            </select>
          </div>

          {/* 🔁 Reset Button */}
          <div className="mb-6 text-right">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* 🏠 Property Results */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <PropertyMarquee properties={properties} />
        )}
      </div>
    </div>
  )
}

export default Property
