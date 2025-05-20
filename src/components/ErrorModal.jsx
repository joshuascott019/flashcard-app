import React from 'react';

export default function ErrorModal({ onReset /*, onMigrate*/, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-80 shadow-lg relative">
        <h2 className="text-xl font-semibold mb-4 text-center">Load Error</h2>
        <p className="text-sm text-gray-700 mb-6">
          We couldn’t read your saved flashcards—your data may be corrupt or
          from an old format.
        </p>
        <div className="flex justify-end gap-2">
          {/* <button
            onClick={onMigrate}
            className="px-4 py-2 rounded bg-slate-500 text-white hover:bg-slate-600"
          >
            Migrate
          </button> */}
          <button
            onClick={onReset}
            className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
          >
            Reset
          </button>
        </div>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
