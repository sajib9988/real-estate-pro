'use client'

import { Mail, PhoneCall, MapPin } from 'lucide-react'

const ContactPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Contact Us</h1>

      <div className="space-y-4 text-gray-600 mb-10">
        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5" />
          <span>support@dreamnest.com</span>
        </div>
        <div className="flex items-center gap-3">
          <PhoneCall className="w-5 h-5" />
          <span>+8801XXXXXXXXX</span>
        </div>
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5" />
          <span>Dhaka, Bangladesh</span>
        </div>
      </div>

      <form className="space-y-6 bg-white p-6 rounded-xl shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700">Your Name</label>
          <input
            type="text"
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email Address</label>
          <input
            type="email"
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Message</label>
          <textarea
            rows={4}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Write your message..."
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Send Message
        </button>
      </form>
    </div>
  )
}

export default ContactPage
