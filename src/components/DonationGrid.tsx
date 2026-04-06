import DonationCard from "./DonationCard";

export default function DonationGrid({ items }: { items: any[] }) {
  if (items.length === 0) {
    return <p className="text-center text-gray-500">No items found.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {items.map((item) => (
        <DonationCard key={item.id} item={item} />
      ))}
    </div>
  );
}
