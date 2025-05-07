// src/components/ManageDecksModal.jsx
import React from 'react';

export default function ManageDecksModal({ libraries, onUpdate, onClose }) {
  const handleNameChange = (idx, value) => {
    const updated = libraries.map((lib, i) =>
      i === idx ? { ...lib, name: value } : lib
    );
    onUpdate(updated);
  };

  const handleDelete = (idx) => {
    if (!window.confirm('Delete this deck?')) return;
    const updated = libraries.filter((_, i) => i !== idx);
    onUpdate(updated);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-11/12 max-w-2xl h-5/6 overflow-auto shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Manage Decks</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-black">
            ✕
          </button>
        </div>
        <div className="space-y-2">
          {libraries.map((lib, idx) => (
            <div key={lib.id} className="flex gap-2 items-center">
              <input
                className="flex-1 border p-1 rounded"
                value={lib.name}
                onChange={(e) => handleNameChange(idx, e.target.value)}
              />
              <button
                onClick={() => handleDelete(idx)}
                className="px-2 text-red-600 hover:text-red-800"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
