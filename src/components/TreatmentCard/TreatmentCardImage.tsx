
import React from 'react';

interface TreatmentCardImageProps {
  image?: string;
  name: string;
}

const TreatmentCardImage: React.FC<TreatmentCardImageProps> = ({ 
  image, 
  name 
}) => {
  return (
    <div className="relative h-56 overflow-hidden bg-gray-100">
      <img
        src={image || '/placeholder.svg'}
        alt={name}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
    </div>
  );
};

export default TreatmentCardImage;
