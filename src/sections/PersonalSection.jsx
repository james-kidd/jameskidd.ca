import React from "react";
import { Camera, Coffee } from "lucide-react";

export default function PersonalSection({ data }) {
  return (
    <div className="space-y-12">
      {/* TOP: TEXT + STATS */}
      <div className="grid md:grid-cols-3 gap-8 items-start">
        {/* Description */}
        <div className="md:col-span-2">
          <h2 className="section-title mb-6">Offline Mode</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            {data.description}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center">
            <Coffee className="w-4 h-4 mr-2" />
            Quick Stats
          </h3>

          <div className="space-y-3">
            {data.favorites.map((fav) => (
              <div key={fav.label} className="flex flex-col">
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

      {/* GALLERY */}
      <div>
        <h3 className="font-bold text-xl mb-6 flex items-center">
          <Camera className="w-5 h-5 mr-2" />
          Gallery
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data.gallery.map((img) => (
            <div
              key={img.src}
              className={`relative overflow-hidden rounded-xl bg-gray-100 group ${
                img.featured ? "md:col-span-2 md:row-span-2" : ""
              }`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover min-h-50 transition-transform duration-500 group-hover:scale-110"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
