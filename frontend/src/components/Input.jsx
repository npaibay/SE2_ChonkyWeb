function Input({ 
  label, 
  type = "text", 
  placeholder, 
  value, 
  onChange, 
  error, 
  required = false,
  className = "",
  ...props 
}) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-white">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-red-400 text-xs">{error}</p>
      )}
    </div>
  );
}

export default Input;
