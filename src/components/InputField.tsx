interface Props {
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const InputField: React.FC<Props> = ({ label, placeholder, value, onChange, className }) => (
  <div className="mb-6">
    {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
    <input 
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none ${className}`}
    />
  </div>
);

export default InputField;