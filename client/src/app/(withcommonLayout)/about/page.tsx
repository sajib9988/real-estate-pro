'use client'

const AboutPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">About DreamNest</h1>
      <p className="text-gray-600 leading-relaxed text-lg">
        DreamNest is a modern real estate platform built to simplify the process of finding your dream home.
        Whether you are  looking to buy, rent, or sell property, we offer a seamless, trusted experience.
      </p>

      <div className="mt-8 space-y-4 text-gray-600">
        <p>
          🏠 We offer verified property listings across major cities in Bangladesh.
        </p>
        <p>
          🔒 Secure and transparent transactions.
        </p>
        <p>
          🤝 Customer support to guide you every step of the way.
        </p>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">Our Mission</h2>
        <p className="text-gray-600">
          To revolutionize the real estate experience in Bangladesh by providing smart, trustworthy, and user-friendly tools.
        </p>
      </div>
    </div>
  )
}

export default AboutPage
