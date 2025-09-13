function Card({ 
  children, 
  className = "", 
  title, 
  subtitle,
  header,
  footer,
  ...props 
}) {
  return (
    <div 
      className={`bg-gray-800 rounded-lg shadow-md border border-gray-700 ${className}`}
      {...props}
    >
      {(title || subtitle || header) && (
        <div className="px-6 py-4 border-b border-gray-700">
          {header || (
            <>
              {title && (
                <h3 className="text-lg font-semibold text-white">{title}</h3>
              )}
              {subtitle && (
                <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
              )}
            </>
          )}
        </div>
      )}
      
      <div className="px-6 py-4">
        {children}
      </div>
      
      {footer && (
        <div className="px-6 py-4 border-t border-gray-700 bg-gray-750">
          {footer}
        </div>
      )}
    </div>
  );
}

export default Card;
