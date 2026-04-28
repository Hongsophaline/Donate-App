import { Loader2 } from "lucide-react";

const Loader = () => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-4">
    <Loader2 className="animate-spin text-[#2DBB74]" size={40} />
    <p className="text-gray-500 font-medium">Loading...</p>
  </div>
);

export default Loader;