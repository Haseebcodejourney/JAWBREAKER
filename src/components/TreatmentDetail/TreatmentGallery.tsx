
import React from 'react';

interface TreatmentGalleryProps {
  treatment: any;
}

const TreatmentGallery: React.FC<TreatmentGalleryProps> = ({ treatment }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <div className="md:row-span-2">
          <img 
            src={treatment.images?.[0] || '/placeholder.svg'} 
            alt={treatment.name}
            className="w-full h-64 md:h-full object-cover rounded-lg"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {treatment.images?.slice(1, 5).map((image: string, index: number) => (
            <img 
              key={index}
              src={image} 
              alt={`${treatment.name} ${index + 2}`}
              className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TreatmentGallery;
