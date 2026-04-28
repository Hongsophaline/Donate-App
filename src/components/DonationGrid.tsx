import DonationCard from './DonationCard';

const DonationGrid = ({ items, onItemClick }: { items: any[]; onItemClick: (id: string) => void }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
    {items.map((item) => (
      <DonationCard key={item.id} item={item} onOpenRequest={onItemClick} />
    ))}
  </div>
);

export default DonationGrid;