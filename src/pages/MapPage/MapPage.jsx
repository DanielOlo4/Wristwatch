import React from "react";

function MapPage() {
  return (
    <div className="p-5 text-center">
      <h1 className="text-2xl font-bold mb-2">🗺️ Map Page</h1>
      <p className="text-gray-700">Here you can display your Google Map locator.</p>

      <div className="mt-5 w-full max-w-4xl h-[450px] mx-auto rounded-lg overflow-hidden shadow-md">
        <iframe
          title="Nigeria Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d8196193.466488181!2d2.6769328!3d9.0820!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104c11d0c0b1b7f7%3A0xf14b6f6e7641c8!2sNigeria!5e0!3m2!1sen!2sng!4v1631884753456!5m2!1sen!2sng"
          className="w-full h-full border-0"
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
}

export default MapPage;
