import React, { useState } from "react";

function International() {
  const [activeSection, setActiveSection] = useState("care-instructions");

  const menuItems = [
    { id: "care-instructions", label: "Care instructions" },
    { id: "contact-us", label: "Contact us" },
    { id: "service-center", label: "Find a service center" },
    { id: "watch-history", label: "History of my watch" },
    { id: "services", label: "Services" },
    { id: "send-watch", label: "Send us your watch" },
    { id: "warranty", label: "Warranty" }
  ];

  const contentSections = {
    "care-instructions": {
      title: "Care Instructions",
      content: "Learn how to properly maintain and care for your timepiece to ensure its longevity and performance."
    },
    "contact-us": {
      title: "Contact Us",
      content: "Get in touch with our customer service team for any inquiries or assistance you may need."
    },
    "service-center": {
      title: "Find a Service Center",
      content: "Locate authorized service centers near you for professional watch maintenance and repairs."
    },
    "watch-history": {
      title: "History of My Watch",
      content: "Access the complete service history and documentation for your registered timepiece."
    },
    "services": {
      title: "Services",
      content: "Explore our comprehensive range of watch services including maintenance, repairs, and restoration."
    },
    "send-watch": {
      title: "Send Us Your Watch",
      content: "Instructions and process for sending your watch to our service center for maintenance or repair."
    },
    "warranty": {
      title: "Warranty Information",
      content: "Details about your watch's warranty coverage, terms, and conditions."
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* Premium Header */}
      <header className="bg-white/95 backdrop-blur-lg shadow-2xl border-b border-blue-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-10">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent drop-shadow-sm">
                DanTechy
              </h1>
              <nav className="hidden md:flex space-x-8">
                <a href="#" className="text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 relative group py-2">
                  International
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full rounded-full"></span>
                </a>
                <a href="#" className="text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 relative group py-2">
                  Our universe
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full rounded-full"></span>
                </a>
              </nav>
            </div>
            <div className="relative group">
              <input
                type="text"
                placeholder="Search"
                className="pl-12 pr-6 py-3.5 border-2 border-gray-200/80 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:outline-none transition-all duration-300 w-80 bg-white/90 backdrop-blur-sm shadow-lg group-hover:shadow-xl text-gray-700 placeholder-gray-400 font-medium"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Luxury Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-blue-100/50 p-6 sticky top-8 transition-all duration-300 hover:shadow-3xl">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-[#3D2B1F] to-[#523522] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl text-white">💎</span>
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-blue-700 bg-clip-text text-transparent">Customer Service</h2>
              </div>
              
              {/* Know-how Section */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 bg-gradient-to-r from-gray-100 to-blue-50 px-4 py-3 rounded-xl border border-gray-200/50">
                  Know-how
                </h3>
                <nav className="space-y-3">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full text-left px-5 py-4 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-[1.02] ${
                        activeSection === item.id
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-2xl border-2 border-blue-300/30"
                          : "text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700 border-2 border-transparent hover:border-blue-200/50"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">
                          {item.id === "care-instructions" && "🔧"}
                          {item.id === "contact-us" && "📞"}
                          {item.id === "service-center" && "🏢"}
                          {item.id === "watch-history" && "📊"}
                          {item.id === "services" && "⚙️"}
                          {item.id === "send-watch" && "📦"}
                          {item.id === "warranty" && "🛡️"}
                        </span>
                        <span>{item.label}</span>
                      </div>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Brand Categories */}
              <div className="border-t border-blue-200/50 pt-8">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 bg-gradient-to-r from-gray-100 to-blue-50 px-4 py-3 rounded-xl border border-gray-200/50">
                  Our Collections
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <a href="#" className="text-gray-700 hover:text-blue-600 p-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 text-center font-semibold border-2 border-transparent hover:border-blue-200/50 hover:shadow-lg">
                    MASTER
                  </a>
                  <a href="#" className="text-gray-700 hover:text-blue-600 p-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 text-center font-semibold border-2 border-transparent hover:border-blue-200/50 hover:shadow-lg">
                    CONQUEST
                  </a>
                  <a href="#" className="text-gray-700 hover:text-blue-600 p-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 text-center font-semibold border-2 border-transparent hover:border-blue-200/50 hover:shadow-lg">
                    LUXURY
                  </a>
                  <a href="#" className="text-gray-700 hover:text-blue-600 p-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 text-center font-semibold border-2 border-transparent hover:border-blue-200/50 hover:shadow-lg">
                    ELEGANCE
                  </a>
                  <a href="#" className="text-gray-700 hover:text-blue-600 p-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 text-center font-semibold border-2 border-transparent hover:border-blue-200/50 hover:shadow-lg col-span-2">
                    CLASSIC
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-blue-100/50 p-8 transition-all duration-500 hover:shadow-3xl">
              {/* Premium Header Section */}
              <div className="text-center mb-12">
                <div className="inline-block bg-gradient-to-r from-[#3D2B1F] to-[#523522] p-1.5 rounded-2xl mb-6 shadow-2xl">
                  <div className="bg-white rounded-xl p-3">
                    <div className="w-20 h-20 bg-gradient-to-r from-[#3D2B1F] to-[#523522] rounded-2xl flex items-center justify-center shadow-inner">
                      <span className="text-3xl text-white">
                        {activeSection === "care-instructions" && "🔧"}
                        {activeSection === "contact-us" && "📞"}
                        {activeSection === "service-center" && "🏢"}
                        {activeSection === "watch-history" && "📊"}
                        {activeSection === "services" && "⚙️"}
                        {activeSection === "send-watch" && "📦"}
                        {activeSection === "warranty" && "🛡️"}
                      </span>
                    </div>
                  </div>
                </div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-4 drop-shadow-sm">
                  {contentSections[activeSection].title}
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
                  {contentSections[activeSection].content}
                </p>
                <div className="w-32 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mt-8 shadow-lg"></div>
              </div>
              
              <div className="prose max-w-none">
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  {contentSections[activeSection].content}
                </p>
                
                {/* Dynamic content based on active section - ALL ORIGINAL CONTENT PRESERVED */}
                {activeSection === "care-instructions" && (
                  <div className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-8 rounded-2xl shadow-xl border-2 border-blue-200/50 transition-all duration-300 hover:shadow-2xl">
                        <h3 className="font-bold text-gray-900 text-2xl mb-6">Daily Care</h3>
                        <ul className="text-gray-700 space-y-4 text-lg">
                          <li className="flex items-center">
                            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-4 flex-shrink-0"></div>
                            <span>Clean with a soft, dry cloth regularly</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-4 flex-shrink-0"></div>
                            <span>Avoid contact with chemicals and perfumes</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-4 flex-shrink-0"></div>
                            <span>Keep away from strong magnetic fields</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-4 flex-shrink-0"></div>
                            <span>Store in a cool, dry place when not in use</span>
                          </li>
                        </ul>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-green-100/50 p-8 rounded-2xl shadow-xl border-2 border-green-200/50 transition-all duration-300 hover:shadow-2xl">
                        <h3 className="font-bold text-gray-900 text-2xl mb-6">Water Resistance</h3>
                        <ul className="text-gray-700 space-y-4 text-lg">
                          <li className="flex items-center">
                            <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mr-4 flex-shrink-0"></div>
                            <span>Check water resistance rating regularly</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mr-4 flex-shrink-0"></div>
                            <span>Avoid pressing buttons underwater</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mr-4 flex-shrink-0"></div>
                            <span>Rinse with fresh water after saltwater exposure</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mr-4 flex-shrink-0"></div>
                            <span>Have seals checked annually by professionals</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-100/50 p-8 rounded-2xl shadow-xl border-2 border-yellow-200/50 transition-all duration-300 hover:shadow-2xl">
                      <h3 className="font-bold text-gray-900 text-2xl mb-6">Professional Maintenance</h3>
                      <p className="text-gray-700 text-lg mb-6 font-medium">For optimal performance, we recommend:</p>
                      <ul className="text-gray-700 space-y-4 text-lg">
                        <li className="flex items-center">
                          <div className="w-3 h-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mr-4 flex-shrink-0"></div>
                          <span>Complete service every 3-5 years</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-3 h-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mr-4 flex-shrink-0"></div>
                          <span>Battery replacement when movement slows</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-3 h-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mr-4 flex-shrink-0"></div>
                          <span>Crystal polishing for minor scratches</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-3 h-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mr-4 flex-shrink-0"></div>
                          <span>Bracelet adjustment for perfect fit</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeSection === "contact-us" && (
                  <div className="space-y-8">
                    <div className="grid md:grid-cols-3 gap-8">
                      <div className="text-center p-8 border-2 border-blue-200/50 rounded-2xl bg-gradient-to-b from-white to-blue-50/70 transition-all duration-300 hover:shadow-2xl">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <h4 className="font-bold text-gray-900 text-xl mb-3">Phone</h4>
                        <p className="text-gray-700 font-bold text-xl mb-2">+234 (0803) 726-2477</p>
                        <p className="text-gray-500 text-sm font-medium">Mon-Fri: 8AM-6PM WAT</p>
                      </div>
                      <div className="text-center p-8 border-2 border-green-200/50 rounded-2xl bg-gradient-to-b from-white to-green-50/70 transition-all duration-300 hover:shadow-2xl">
                        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <h4 className="font-bold text-gray-900 text-xl mb-3">Email</h4>
                        <p className="text-gray-700 font-bold text-xl mb-2">dantechy130@gmail.com</p>
                        <p className="text-gray-500 text-sm font-medium">Response within 24 hours</p>
                      </div>
                      <div className="text-center p-8 border-2 border-purple-200/50 rounded-2xl bg-gradient-to-b from-white to-purple-50/70 transition-all duration-300 hover:shadow-2xl">
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-1m6 0v-1a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2h1m4 0h4" />
                          </svg>
                        </div>
                        <h4 className="font-bold text-gray-900 text-xl mb-3">Live Chat</h4>
                        <p className="text-gray-700 font-bold text-xl mb-2">Available 24/7</p>
                        <p className="text-gray-500 text-sm font-medium">Instant support</p>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-blue-50/50 p-8 rounded-2xl shadow-xl border-2 border-gray-200/50">
                      <h3 className="font-bold text-gray-900 text-3xl mb-4">Visit Our Headquarters</h3>
                      <p className="text-gray-700 text-xl font-medium">123 Luxury Watch Avenue, Victoria Island, Lagos, Nigeria</p>
                      <p className="text-gray-600 text-lg mt-3 font-medium">Opening Hours: Monday - Saturday, 9:00 AM - 7:00 PM</p>
                    </div>
                  </div>
                )}

                {activeSection === "service-center" && (
                  <div className="space-y-8">
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50/50 p-8 rounded-2xl shadow-xl border-2 border-blue-200/50">
                      <h3 className="font-bold text-gray-900 text-3xl mb-6">Global Service Network</h3>
                      <p className="text-gray-700 text-xl mb-8 leading-relaxed">
                        DanTechy maintains a comprehensive network of authorized service centers worldwide, 
                        ensuring your timepiece receives the expert care it deserves no matter where you are.
                      </p>
                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <h4 className="font-bold text-gray-800 text-2xl mb-6">Africa</h4>
                          <ul className="text-gray-700 space-y-4 text-lg">
                            <li className="flex items-center">
                              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-4 flex-shrink-0"></div>
                              <span>Lagos, Nigeria - Flagship Service Center</span>
                            </li>
                            <li className="flex items-center">
                              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-4 flex-shrink-0"></div>
                              <span>Accra, Ghana - Certified Workshop</span>
                            </li>
                            <li className="flex items-center">
                              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-4 flex-shrink-0"></div>
                              <span>Nairobi, Kenya - Authorized Partner</span>
                            </li>
                            <li className="flex items-center">
                              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-4 flex-shrink-0"></div>
                              <span>Johannesburg, South Africa - Premium Service</span>
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800 text-2xl mb-6">Europe & Americas</h4>
                          <ul className="text-gray-700 space-y-4 text-lg">
                            <li className="flex items-center">
                              <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-4 flex-shrink-0"></div>
                              <span>London, UK - European Headquarters</span>
                            </li>
                            <li className="flex items-center">
                              <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-4 flex-shrink-0"></div>
                              <span>New York, USA - North America Center</span>
                            </li>
                            <li className="flex items-center">
                              <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-4 flex-shrink-0"></div>
                              <span>Dubai, UAE - Middle East Hub</span>
                            </li>
                            <li className="flex items-center">
                              <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-4 flex-shrink-0"></div>
                              <span>Singapore - Asia Pacific Center</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="border-2 border-blue-200/50 p-8 rounded-2xl bg-gradient-to-b from-white to-blue-50/70 transition-all duration-300 hover:shadow-xl">
                        <h4 className="font-bold text-gray-800 text-2xl mb-6">What to Expect</h4>
                        <ul className="text-gray-700 space-y-4 text-lg">
                          <li className="flex items-center">
                            <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mr-4 flex-shrink-0"></div>
                            <span>Genuine DanTechy parts and components</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mr-4 flex-shrink-0"></div>
                            <span>Factory-trained watchmakers</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mr-4 flex-shrink-0"></div>
                            <span>State-of-the-art diagnostic equipment</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mr-4 flex-shrink-0"></div>
                            <span>12-month service warranty on all repairs</span>
                          </li>
                        </ul>
                      </div>
                      <div className="border-2 border-green-200/50 p-8 rounded-2xl bg-gradient-to-b from-white to-green-50/70 transition-all duration-300 hover:shadow-xl">
                        <h4 className="font-bold text-gray-800 text-2xl mb-6">Before You Visit</h4>
                        <ul className="text-gray-700 space-y-4 text-lg">
                          <li className="flex items-center">
                            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-4 flex-shrink-0"></div>
                            <span>Bring your warranty card and purchase receipt</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-4 flex-shrink-0"></div>
                            <span>Note any specific issues or concerns</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-4 flex-shrink-0"></div>
                            <span>Remove personal belongings from the watch</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-4 flex-shrink-0"></div>
                            <span>Call ahead for appointment scheduling</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === "watch-history" && (
                  <div className="space-y-8">
                    <div className="bg-gradient-to-br from-green-50 to-green-100/50 p-8 rounded-2xl shadow-xl border-2 border-green-200/50">
                      <h3 className="font-bold text-gray-900 text-3xl mb-6">Your Timepiece's Journey</h3>
                      <p className="text-gray-700 text-xl mb-4 leading-relaxed">
                        Every DanTechy watch has a story. Track your watch's complete service history, 
                        maintenance records, and ownership journey through our digital archive system.
                      </p>
                    </div>
                    
                    <div className="border-2 border-gray-200/50 rounded-2xl overflow-hidden shadow-xl">
                      <div className="bg-gradient-to-r from-gray-50 to-blue-50/50 px-8 py-6 border-b-2 border-gray-200/50">
                        <h4 className="font-bold text-gray-800 text-2xl">Service History Timeline</h4>
                      </div>
                      <div className="divide-y-2 divide-gray-100/50">
                        <div className="p-8">
                          <div className="flex justify-between items-start mb-4">
                            <h5 className="font-bold text-gray-800 text-xl">Complete Overhaul Service</h5>
                            <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm px-4 py-2 rounded-full font-semibold shadow-lg">Completed</span>
                          </div>
                          <p className="text-gray-600 text-lg mb-3 font-medium">Lagos Flagship Service Center</p>
                          <p className="text-gray-500 text-lg mb-4">March 15, 2024 | Service ID: DT20240315-0876</p>
                          <ul className="text-gray-700 space-y-3 text-lg">
                            <li className="flex items-center">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                              <span>Movement disassembly and ultrasonic cleaning</span>
                            </li>
                            <li className="flex items-center">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                              <span>Replacement of worn components</span>
                            </li>
                            <li className="flex items-center">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                              <span>Water resistance testing and seal replacement</span>
                            </li>
                            <li className="flex items-center">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                              <span>72-hour accuracy monitoring</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="p-8">
                          <div className="flex justify-between items-start mb-4">
                            <h5 className="font-bold text-gray-800 text-xl">Battery Replacement & Inspection</h5>
                            <span className="bg-gradient-to-r from-green-500 to-green-600 text-white text-sm px-4 py-2 rounded-full font-semibold shadow-lg">Completed</span>
                          </div>
                          <p className="text-gray-600 text-lg mb-3 font-medium">Accra Certified Workshop</p>
                          <p className="text-gray-500 text-lg mb-4">August 22, 2023 | Service ID: DT20230822-1543</p>
                          <ul className="text-gray-700 space-y-3 text-lg">
                            <li className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                              <span>Genuine DanTechy battery installed</span>
                            </li>
                            <li className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                              <span>Comprehensive movement inspection</span>
                            </li>
                            <li className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                              <span>Case and bracelet polishing</span>
                            </li>
                            <li className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                              <span>Water resistance verification</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="p-8">
                          <div className="flex justify-between items-start mb-4">
                            <h5 className="font-bold text-gray-800 text-xl">Initial Purchase & Registration</h5>
                            <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm px-4 py-2 rounded-full font-semibold shadow-lg">Registered</span>
                          </div>
                          <p className="text-gray-600 text-lg mb-3 font-medium">DanTechy Luxury Boutique, Lagos</p>
                          <p className="text-gray-500 text-lg mb-4">January 10, 2022 | Serial: DT8A4276X9</p>
                          <ul className="text-gray-700 space-y-3 text-lg">
                            <li className="flex items-center">
                              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                              <span>Watch added to international database</span>
                            </li>
                            <li className="flex items-center">
                              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                              <span>3-year international warranty activated</span>
                            </li>
                            <li className="flex items-center">
                              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                              <span>Owner details registered</span>
                            </li>
                            <li className="flex items-center">
                              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                              <span>Initial quality inspection passed</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-100/50 p-8 rounded-2xl shadow-xl border-2 border-yellow-200/50">
                      <h4 className="font-bold text-gray-800 text-2xl mb-4">Next Recommended Service</h4>
                      <p className="text-gray-700 text-xl">
                        Based on your watch's usage and service history, we recommend a complete service 
                        by <strong className="text-blue-600">March 2026</strong> to maintain optimal performance and preserve your warranty.
                      </p>
                    </div>
                  </div>
                )}

                {activeSection === "services" && (
                  <div className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="border-2 border-blue-200/50 p-8 rounded-2xl bg-gradient-to-b from-white to-blue-50/70 transition-all duration-300 hover:shadow-2xl">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h3 className="font-bold text-gray-900 text-2xl mb-6">Complete Movement Service</h3>
                        <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                          Comprehensive disassembly, cleaning, lubrication, and reassembly of your watch's movement.
                        </p>
                        <ul className="text-gray-700 space-y-4 text-lg">
                          <li className="flex items-center">
                            <div className="w-3 h-3 bg-blue-500 rounded-full mr-4 flex-shrink-0"></div>
                            <span>Ultrasonic cleaning of all components</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-3 h-3 bg-blue-500 rounded-full mr-4 flex-shrink-0"></div>
                            <span>Replacement of worn parts</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-3 h-3 bg-blue-500 rounded-full mr-4 flex-shrink-0"></div>
                            <span>Precision lubrication</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-3 h-3 bg-blue-500 rounded-full mr-4 flex-shrink-0"></div>
                            <span>72-hour accuracy testing</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-3 h-3 bg-blue-500 rounded-full mr-4 flex-shrink-0"></div>
                            <span>24-month service warranty</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="border-2 border-green-200/50 p-8 rounded-2xl bg-gradient-to-b from-white to-green-50/70 transition-all duration-300 hover:shadow-2xl">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                        <h3 className="font-bold text-gray-900 text-2xl mb-6">Water Resistance Testing</h3>
                        <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                          Ensure your watch maintains its water resistance with professional pressure testing.
                        </p>
                        <ul className="text-gray-700 space-y-4 text-lg">
                          <li className="flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-4 flex-shrink-0"></div>
                            <span>Dry and wet pressure testing</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-4 flex-shrink-0"></div>
                            <span>Gasket and seal inspection</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-4 flex-shrink-0"></div>
                            <span>Crown and pusher function check</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-4 flex-shrink-0"></div>
                            <span>Replacement of compromised seals</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-4 flex-shrink-0"></div>
                            <span>Certification of water resistance</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="border-2 border-purple-200/50 p-8 rounded-2xl bg-gradient-to-b from-white to-purple-50/70 transition-all duration-300 hover:shadow-2xl">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                          </svg>
                        </div>
                        <h3 className="font-bold text-gray-900 text-2xl mb-6">Case & Bracelet Refinishing</h3>
                        <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                          Restore your watch's appearance with professional polishing and refinishing services.
                        </p>
                        <ul className="text-gray-700 space-y-4 text-lg">
                          <li className="flex items-center">
                            <div className="w-3 h-3 bg-purple-500 rounded-full mr-4 flex-shrink-0"></div>
                            <span>Scratch removal and surface polishing</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-3 h-3 bg-purple-500 rounded-full mr-4 flex-shrink-0"></div>
                            <span>Brushed and polished finish restoration</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-3 h-3 bg-purple-500 rounded-full mr-4 flex-shrink-0"></div>
                            <span>Deep cleaning of bracelet links</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-3 h-3 bg-purple-500 rounded-full mr-4 flex-shrink-0"></div>
                            <span>Clasp mechanism servicing</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-3 h-3 bg-purple-500 rounded-full mr-4 flex-shrink-0"></div>
                            <span>Protective coating application</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="border-2 border-red-200/50 p-8 rounded-2xl bg-gradient-to-b from-white to-red-50/70 transition-all duration-300 hover:shadow-2xl">
                        <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        </div>
                        <h3 className="font-bold text-gray-900 text-2xl mb-6">Battery Replacement</h3>
                        <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                          Professional battery replacement using genuine DanTechy batteries with full testing.
                        </p>
                        <ul className="text-gray-700 space-y-4 text-lg">
                          <li className="flex items-center">
                            <div className="w-3 h-3 bg-red-500 rounded-full mr-4 flex-shrink-0"></div>
                            <span>Genuine manufacturer batteries</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-3 h-3 bg-red-500 rounded-full mr-4 flex-shrink-0"></div>
                            <span>Water resistance testing after replacement</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-3 h-3 bg-red-500 rounded-full mr-4 flex-shrink-0"></div>
                            <span>Movement function verification</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-3 h-3 bg-red-500 rounded-full mr-4 flex-shrink-0"></div>
                            <span>Comprehensive timing check</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-3 h-3 bg-red-500 rounded-full mr-4 flex-shrink-0"></div>
                            <span>12-month battery warranty</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-gray-50 to-blue-50/50 p-8 rounded-2xl shadow-xl border-2 border-gray-200/50">
                      <h3 className="font-bold text-gray-900 text-3xl mb-6">Service Packages</h3>
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center p-6 border-2 border-blue-200/50 rounded-2xl bg-white transition-all duration-300 hover:shadow-xl hover:border-blue-300/70">
                          <h4 className="font-bold text-gray-800 text-xl mb-4">Essential Care</h4>
                          <p className="text-3xl font-bold text-blue-600 mb-4">₦25,000</p>
                          <p className="text-gray-600 text-lg">Battery replacement + water resistance test</p>
                        </div>
                        <div className="text-center p-6 border-2 border-green-200/50 rounded-2xl bg-white transition-all duration-300 hover:shadow-xl hover:border-green-300/70">
                          <h4 className="font-bold text-gray-800 text-xl mb-4">Premium Service</h4>
                          <p className="text-3xl font-bold text-blue-600 mb-4">₦75,000</p>
                          <p className="text-gray-600 text-lg">Complete movement service + refinishing</p>
                        </div>
                        <div className="text-center p-6 border-2 border-purple-200/50 rounded-2xl bg-white transition-all duration-300 hover:shadow-xl hover:border-purple-300/70">
                          <h4 className="font-bold text-gray-800 text-xl mb-4">Comprehensive</h4>
                          <p className="text-3xl font-bold text-blue-600 mb-4">₦120,000</p>
                          <p className="text-gray-600 text-lg">Full overhaul + parts replacement + 2-year warranty</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === "send-watch" && (
                  <div className="space-y-8">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-8 rounded-2xl shadow-xl border-2 border-blue-200/50">
                      <h3 className="font-bold text-gray-900 text-3xl mb-6">Secure Watch Shipping Process</h3>
                      <p className="text-gray-700 text-xl leading-relaxed">
                        Sending your DanTechy timepiece for service is safe and straightforward. Follow our 
                        detailed instructions to ensure your watch arrives securely at our service center.
                      </p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                      <div className="text-center p-8 border-2 border-green-200/50 rounded-2xl bg-gradient-to-br from-gray-50 to-blue-50/50  transition-all duration-300 hover:shadow-2xl">
                        <div className="w-20 h-20 bg-gradient-to-r from-[#3D2B1F] to-[#523522] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                          <span className="text-3xl font-bold text-white">1</span>
                        </div>
                        <h4 className="font-bold text-gray-800 text-2xl mb-6">Preparation</h4>
                        <ul className="text-gray-700 space-y-4 text-lg text-left">
                          <li className="flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-4 flex-shrink-0"></div>
                            <span>Complete the online service form</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-4 flex-shrink-0"></div>
                            <span>Print and include the service reference</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-4 flex-shrink-0"></div>
                            <span>Remove watch from bracelet if possible</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-4 flex-shrink-0"></div>
                            <span>Take photos of current condition</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="text-center p-8 border-2 border-yellow-200/50 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50/5 transition-all duration-300 hover:shadow-2xl">
                        <div className="w-20 h-20 bg-gradient-to-r from-[#3D2B1F] to-[#523522] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                          <span className="text-3xl font-bold text-white">2</span>
                        </div>
                        <h4 className="font-bold text-gray-800 text-2xl mb-6">Packaging</h4>
                        <ul className="text-gray-700 space-y-4 text-lg text-left">
                          <li className="flex items-center">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-4 flex-shrink-0"></div>
                            <span>Use original watch box if available</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-4 flex-shrink-0"></div>
                            <span>Wrap watch in soft, anti-static material</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-4 flex-shrink-0"></div>
                            <span>Include all documentation</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-4 flex-shrink-0"></div>
                            <span>Seal package securely</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="text-center p-8 border-2 border-red-200/50 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50/5 transition-all duration-300 hover:shadow-2xl">
                        <div className="w-20 h-20 bg-gradient-to-r from-[#3D2B1F] to-[#523522] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                          <span className="text-3xl font-bold text-white">3</span>
                        </div>
                        <h4 className="font-bold text-gray-800 text-2xl mb-6">Shipping</h4>
                        <ul className="text-gray-700 space-y-4 text-lg text-left">
                          <li className="flex items-center">
                            <div className="w-3 h-3 bg-red-500 rounded-full mr-4 flex-shrink-0"></div>
                            <span>Use insured, trackable shipping</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-3 h-3 bg-red-500 rounded-full mr-4 flex-shrink-0"></div>
                            <span>Address: DanTechy Service Center, Lagos</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-3 h-3 bg-red-500 rounded-full mr-4 flex-shrink-0"></div>
                            <span>Keep tracking number safe</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-3 h-3 bg-red-500 rounded-full mr-4 flex-shrink-0"></div>
                            <span>Expect confirmation within 48 hours</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="border-2 border-gray-200/50 p-8 rounded-2xl bg-gradient-to-b from-white to-gray-50/70">
                      <h4 className="font-bold text-gray-800 text-2xl mb-6">Shipping Address</h4>
                      <div className="bg-gradient-to-r from-gray-50 to-blue-50/50 p-6 rounded-xl border-2 border-gray-200/50">
                        <p className="text-gray-800 font-bold text-xl mb-2">DanTechy International Service Center</p>
                        <p className="text-gray-700 text-lg">23 Ipaja Shopping Mall, Ipaja, Lagos</p>
                        <p className="text-gray-700 text-lg">Lagos Island</p>
                        <p className="text-gray-700 text-lg">Lagos, Nigeria</p>
                        <p className="text-gray-700 text-lg mt-4 font-semibold">Phone: +234 (0803) 726-2477</p>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-100/50 p-8 rounded-2xl shadow-xl border-2 border-yellow-200/50">
                      <h4 className="font-bold text-gray-800 text-2xl mb-6">Important Notes</h4>
                      <ul className="text-gray-700 space-y-4 text-xl">
                        <li className="flex items-center">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full mr-4 flex-shrink-0"></div>
                          <span>Always use insured shipping with tracking capability</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full mr-4 flex-shrink-0"></div>
                          <span>Do not include watch winders or valuable accessories</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full mr-4 flex-shrink-0"></div>
                          <span>Keep a copy of all shipping documents</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full mr-4 flex-shrink-0"></div>
                          <span>Contact us immediately if tracking shows delays</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full mr-4 flex-shrink-0"></div>
                          <span>Typical service turnaround: 2-4 weeks</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeSection === "warranty" && (
                  <div className="space-y-8">
                    <div className="bg-gradient-to-br from-green-50 to-green-100/50 p-8 rounded-2xl shadow-xl border-2 border-green-200/50">
                      <h3 className="font-bold text-gray-900 text-3xl mb-6">International Warranty Coverage</h3>
                      <p className="text-gray-700 text-xl leading-relaxed">
                        Your DanTechy timepiece is protected by our comprehensive international warranty, 
                        ensuring peace of mind and exceptional service worldwide.
                      </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="border-2 border-green-200/50 p-8 rounded-2xl bg-gradient-to-b from-white to-green-50/70 transition-all duration-300 hover:shadow-xl">
                        <h4 className="font-bold text-gray-800 text-2xl mb-6">What's Covered</h4>
                        <ul className="text-gray-700 space-y-6 text-lg">
                          <li className="flex items-start">
                            <svg className="w-7 h-7 text-green-500 mr-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-lg">Manufacturing defects in materials and workmanship</span>
                          </li>
                          <li className="flex items-start">
                            <svg className="w-7 h-7 text-green-500 mr-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-lg">Movement malfunctions under normal use</span>
                          </li>
                          <li className="flex items-start">
                            <svg className="w-7 h-7 text-green-500 mr-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-lg">Water resistance issues (within rated limits)</span>
                          </li>
                          <li className="flex items-start">
                            <svg className="w-7 h-7 text-green-500 mr-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-lg">Battery replacement for the first 24 months</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="border-2 border-red-200/50 p-8 rounded-2xl bg-gradient-to-b from-white to-red-50/70 transition-all duration-300 hover:shadow-xl">
                        <h4 className="font-bold text-gray-800 text-2xl mb-6">What's Not Covered</h4>
                        <ul className="text-gray-700 space-y-6 text-lg">
                          <li className="flex items-start">
                            <svg className="w-7 h-7 text-red-500 mr-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span className="text-lg">Normal wear and tear or aging</span>
                          </li>
                          <li className="flex items-start">
                            <svg className="w-7 h-7 text-red-500 mr-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span className="text-lg">Damage from accidents, misuse, or neglect</span>
                          </li>
                          <li className="flex items-start">
                            <svg className="w-7 h-7 text-red-500 mr-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span className="text-lg">Battery replacement after 24 months</span>
                          </li>
                          <li className="flex items-start">
                            <svg className="w-7 h-7 text-red-500 mr-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span className="text-lg">Services performed by unauthorized personnel</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="border-2 border-gray-200/50 p-8 rounded-2xl bg-gradient-to-b from-white to-gray-50/70">
                      <h4 className="font-bold text-gray-800 text-2xl mb-6">Warranty Periods</h4>
                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <h5 className="font-bold text-gray-700 text-xl mb-4">Standard Warranty</h5>
                          <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 p-6 rounded-xl border-2 border-blue-200/50">
                            <p className="text-4xl font-bold text-blue-600 mb-2">3 Years</p>
                            <p className="text-gray-600 text-lg">From date of purchase for all components</p>
                          </div>
                        </div>
                        <div>
                          <h5 className="font-bold text-gray-700 text-xl mb-4">Extended Warranty</h5>
                          <div className="bg-gradient-to-r from-green-50 to-green-100/50 p-6 rounded-xl border-2 border-green-200/50">
                            <p className="text-4xl font-bold text-green-600 mb-2">+2 Years</p>
                            <p className="text-gray-600 text-lg">Available with annual service maintenance</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-100/50 p-8 rounded-2xl shadow-xl border-2 border-yellow-200/50">
                      <h4 className="font-bold text-gray-800 text-2xl mb-6">Warranty Registration</h4>
                      <p className="text-gray-700 text-xl mb-6 leading-relaxed">
                        To activate your international warranty, please register your timepiece within 
                        30 days of purchase using the warranty card included with your watch.
                      </p>
                      <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
                        Register Your Warranty Online
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
<footer className="mt-12 bg-gradient-to-r from-[#3D2B1F] to-[#523522] text-white rounded-2xl p-6">
  <div className="max-w-6xl mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* About Us */}
      <div>
        <h3 className="text-base font-bold mb-3">ABOUT US</h3>
        <p className="text-gray-300 text-sm leading-relaxed">
          DanTechy is your one-stop online watch store for genuine affordable luxury watches from global brands.
        </p>
      </div>

      {/* Policy */}
      <div>
        <h3 className="text-base font-semibold mb-3">POLICY</h3>
        <ul className="space-y-1 text-gray-300 text-sm">
          <li>Returns & Refunds</li>
          <li>Terms & Conditions</li>
          <li>Career</li>
        </ul>
      </div>

      {/* Store Locations */}
      <div>
        <h3 className="text-base font-semibold mb-3">OUR STORES</h3>
        <div className="space-y-2 text-gray-300 text-sm">
          <div>
            <p className="font-medium">Main Office:</p>
            <p>15, Awoyaya Shopping Complex, Eti-Osa, Lagos.</p>
          </div>
          <div>
            <p className="font-medium">Ipaja Store:</p>
            <p>Ipaja Market Plaza, Ayobo Road, Lagos</p>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div>
        <h3 className="text-base font-semibold mb-3">CONTACT US</h3>
        <div className="space-y-1 text-gray-300 text-sm">
          <p>+2348037262477</p>
          <p>+2348157991888</p>
          <p>dantechy130@gmail.com</p>
        </div>
      </div>
    </div>

    {/* Copyright */}
    <div className="border-t border-gray-700 mt-6 pt-4 text-center">
      <p className="text-gray-400 text-sm">© 2025 All Rights Reserved.</p>
    </div>
  </div>
</footer>
    </div>
  );
}

export default International;