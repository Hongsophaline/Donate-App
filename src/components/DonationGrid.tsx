import React from 'react';
import DonationCard from './DonationCard';

interface DonationGridProps {
  items: any[]; // Replace 'any' with your DonationItem interface
}

const DonationGrid: React.FC<DonationGridProps> = ({ items }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
    {items.map((item) => (
      <DonationCard key={item.id} item={item} />
    ))}
  </div>
);

export default DonationGrid;