'use client'

import { Facebook, Twitter, Mail, PhoneCall, MapPin, Linkedin } from 'lucide-react'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo + About */}
          <div>
            <h2 className="text-2xl font-bold mb-2">RealEstate-Pro</h2>
            <p className="text-sm text-gray-400">
              Your trusted partner for finding the perfect home. Explore our listings for flats, houses, and commercial spaces.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/buy">Buy Property</Link></li>
              <li><Link href="/rent">Rent Property</Link></li>
              <li><Link href="/sell">Sell Property</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                support@RealEstate-Pro.com
              </li>
              <li className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4" />
                +8801XXXXXXXXX
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Dhaka, Bangladesh
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
            <div className="flex gap-4">
              <Link href="#" className="hover:text-blue-500">
                <Facebook />
              </Link>
              <Link href="#" className="hover:text-sky-400">
                <Twitter />
              </Link>
              <Link href="#" className="hover:text-blue-600">
                <Linkedin />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom line */}
        <div className="border-t border-gray-800 mt-10 pt-6 text-sm text-gray-500 text-center">
          © {new Date().getFullYear()} RealEstate-Pro. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer
