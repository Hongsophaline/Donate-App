import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => (
  <div className="min-h-screen flex flex-col items-center justify-center p-4">
    <AlertCircle className="text-red-500 mb-2" size={48} />
    <h2 className="text-xl font-bold">Connection Error</h2>
    <p className="text-gray-500 mb-6">{message}</p>
    <button
      onClick={onRetry}
      className="flex items-center gap-2 bg-[#2DBB74] text-white px-6 py-2 rounded-xl"
    >
      <RefreshCw size={18} /> Retry
    </button>
  </div>
);

export default ErrorMessage;