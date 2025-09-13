function Button({ children, className = "", type = "button", ...props }) {
  return (
    <button
      type={type}
      className={`px-4 py-2 btn-rounded-3xl font-medium transition duration-200 focus:outline-none ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
