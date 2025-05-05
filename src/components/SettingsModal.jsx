import React from 'react';

export default function SettingsModal({ onClose, onSave, onLoad }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-80 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✖️
          </button>
        </div>
        <div className="flex flex-col gap-4">
          <button
            onClick={onSave}
            className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Save to File
          </button>
          <label className="w-full">
            <span className="block px-4 py-2 bg-blue-500 text-white rounded text-center cursor-pointer hover:bg-blue-600">
              Load File
            </span>
            <input
              type="file"
              accept="application/json"
              onChange={onLoad}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
