// ===== SettingsModal.jsx =====
import React from 'react';

export default function SettingsModal({
  onClose,
  onSave,
  onLoad,
  onClear,
  // onAddCard,
  onShuffle,
  onManageDeck, // for editing cards in a deck
  onManageDecks, // for editing ALL DECKS
  // onCreateDeck,
  libraries,
  currentLibraryIndex,
  onLibraryChange,
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-80 shadow-lg relative">
        <h2 className="text-xl font-semibold mb-4 text-center">Settings</h2>
        <label className="block mb-4">
          <span className="text-sm font-medium">Select Deck:</span>
          <select
            value={currentLibraryIndex}
            onChange={(e) => onLibraryChange(Number(e.target.value))}
            className="mt-1 block w-full px-2 py-1 border rounded"
          >
            {libraries.map((lib, idx) => (
              <option key={lib.id} value={idx}>
                {lib.name}
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-col gap-4">
          <button
            onClick={onShuffle}
            className="px-4 py-2 bg-slate-500 text-white rounded hover:bg-slate-600"
          >
            Shuffle Cards
          </button>

          <button
            onClick={onManageDeck}
            className="px-4 py-2 bg-slate-500 text-white rounded hover:bg-slate-600"
          >
            Edit Cards
          </button>
          <button
            onClick={onManageDecks}
            className="px-4 py-2 bg-slate-500 text-white rounded hover:bg-slate-600"
          >
            Edit Library
          </button>

          <button
            onClick={onSave}
            className="px-4 py-2 bg-slate-500 text-white rounded hover:bg-slate-600"
          >
            Export Library
          </button>

          <label className="px-4 py-2 bg-slate-500 text-white rounded hover:bg-slate-600 text-center cursor-pointer">
            Import Library
            <input
              type="file"
              accept=".json"
              onChange={onLoad}
              className="hidden"
            />
          </label>

          <button
            onClick={onClear}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete Library
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
