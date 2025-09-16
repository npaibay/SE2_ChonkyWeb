import React from "react";

function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-gray-800/90 rounded-xl shadow-lg p-6 relative max-w-2xl w-full">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-xl text-whitish hover:text-yellow font-bold"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;