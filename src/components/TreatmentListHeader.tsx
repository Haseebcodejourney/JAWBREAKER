
import React from 'react';

interface TreatmentListHeaderProps {
  category: string;
  destination: string;
  resultsCount: number;
  getCategoryLabel: (cat: string) => string;
}

const TreatmentListHeader: React.FC<TreatmentListHeaderProps> = ({
  category,
  destination,
  resultsCount,
  getCategoryLabel
}) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {category ? `${getCategoryLabel(category)} Treatments` : 'All Treatments'}
        {destination && ` in ${destination}`}
      </h1>
      <p className="text-gray-600">
        Discover {resultsCount} treatments from verified healthcare providers worldwide
      </p>
    </div>
  );
};

export default TreatmentListHeader;
