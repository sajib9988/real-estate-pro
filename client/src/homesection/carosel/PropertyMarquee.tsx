'use client'

import Marquee from 'react-fast-marquee'

import { Property } from '@/lib/type'
import { PropertyCard } from '../PropertyCard'

interface Props {
  properties: Property[]
}

export const PropertyMarquee = ({ properties }: Props) => {
  return (
    <div className="py-4">
 <Marquee
  pauseOnHover
  gradient={false}
  speed={70}
>
  {properties.map((property) => (
    <div
      key={property.id}
      className="mx-2 min-w-[280px] max-w-[280px] flex-shrink-0"
    >
      <PropertyCard property={property} />
    </div>
  ))}
</Marquee>

    </div>
  )
}
export default PropertyMarquee