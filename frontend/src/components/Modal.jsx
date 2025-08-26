function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-gray-800 text-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-xl text-white hover:text-red-400 focus:outline-none"
          aria-label="Close modal"
        >
          &times;
        </button>

        {/* Title */}
        {title && (
          <h2 className="text-xl font-semibold mb-4">{title}</h2>
        )}

        {/* Content */}
        <div>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;