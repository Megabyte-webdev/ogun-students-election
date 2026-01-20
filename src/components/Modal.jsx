// components/Modal.jsx
import React from "react";
import { X } from "lucide-react";

export default function Modal({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50 backdrop-blur-sm">
      {/* Modal Content */}
      <div className="relative z-10 bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-red-500 hover:text-red-900"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Children (Form) */}
        <div className="mt-4 max-h-[85vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
