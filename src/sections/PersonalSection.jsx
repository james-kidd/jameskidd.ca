import React from 'react';
import { Camera, Coffee, MapPin, Book } from 'lucide-react';

export default function PersonalSection({ data }) {
  return (
    <div className="space-y-12">
      
      {/* Top Section: Text + "Stats" */}
      <div className="grid md:grid-cols-3 gap-8 items-start">
        {/* Description */}
        <div className="md:col-span-2">
          <h2 className="text-3xl font-bold mb-6">Offline Mode</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            {data.description}
          </p>
        </div>

        {/* "Favorites" Mini-Card */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center">
            <Coffee className="w-4 h-4 mr-2" /> 
            Quick Stats
          </h3>
          <div className="space-y-3">
            {data.favorites.map((fav, idx) => (
              <div key={idx} className="flex flex-col">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {fav.label}
                </span>
                <span className="text-gray-800 font-medium">
                  {fav.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Photo Grid (Mosaic Style) */}
      <div>
        <h3 className="font-bold text-xl mb-6 flex items-center">
          <Camera className="w-5 h-5 mr-2" />
          Gallery
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data.gallery.map((img, idx) => (
            <div 
              key={idx} 
              className={`relative overflow-hidden rounded-xl bg-gray-100 group ${
                /* Make every 3rd image span 2 columns for a "mosaic" look */
                (idx % 3 === 0) ? 'md:col-span-2 md:row-span-2' : ''
              }`}
            >
              <img 
                src={img.src} 
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                style={{ minHeight: '200px' }} // Ensures empty placeholders have height
              />
              {/* Subtle Overlay on Hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}