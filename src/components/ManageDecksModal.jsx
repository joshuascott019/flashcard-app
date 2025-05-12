// src/components/ManageDecksModal.jsx
import React from 'react';

export default function ManageDecksModal({
  libraries = [],
  onUpdate,
  onClose,
}) {
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

  const handleAddDeck = () => {
    const newDeck = {
      id: Date.now().toString(),
      name: `Deck ${libraries.length + 1}`,
      cards: [],
    };
    onUpdate([...libraries, newDeck]);
  };

  const handleDownloadDeck = (idx) => {
    const deck = libraries[idx];
    const data = JSON.stringify(deck, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${deck.name}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleImportDeck = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const imported = JSON.parse(evt.target.result);
        const baseName = imported.name?.trim() || 'Imported Deck';

        // build regex to match baseName and baseName (n)
        const esc = baseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const re = new RegExp(`^${esc}(?: \\((\\d+)\\))?$`);

        // find all matching names and extract their indices
        let maxIdx = 0;
        libraries.forEach((lib) => {
          const m = lib.name.match(re);
          if (m) {
            const idx = m[1] ? parseInt(m[1], 10) : 1;
            if (idx > maxIdx) maxIdx = idx;
          }
        });

        let finalName = baseName;
        if (maxIdx > 0) {
          const defaultName = `${baseName} (${maxIdx + 1})`;
          const input = window.prompt(
            `${baseName} already exists in your library. Please change the name and click OK:`,
            defaultName
          );
          if (input === null) return; // cancel import
          finalName = input.trim() || defaultName;
        }

        const newDeck = {
          id: Date.now().toString(),
          name: finalName,
          cards: Array.isArray(imported.cards) ? imported.cards : [],
        };
        onUpdate([...libraries, newDeck]);
      } catch {
        alert('Invalid deck file');
      }
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-11/12 max-w-2xl h-5/6 overflow-auto shadow-lg relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Manage Decks</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-black">
            ✕
          </button>
        </div>

        <div className="space-y-2 mb-16">
          {libraries.map((lib, idx) => (
            <div key={lib.id} className="flex gap-2 items-center">
              <input
                className="flex-1 border p-1 rounded"
                value={lib.name}
                onChange={(e) => handleNameChange(idx, e.target.value)}
              />
              <button
                onClick={() => handleDownloadDeck(idx)}
                className="px-2 text-blue-600 hover:text-blue-800"
              >
                📥
              </button>
              <button
                onClick={() => handleDelete(idx)}
                className="px-2 text-red-600 hover:text-red-800"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={handleAddDeck}
          className="w-full px-4 py-2 bg-slate-500 text-white rounded hover:bg-slate-600 sticky bottom-0"
        >
          Add Deck
        </button>

        <label className="w-full mt-2 block text-center px-4 py-2 bg-slate-500 text-white rounded hover:bg-slate-600 cursor-pointer sticky bottom-0">
          Import Deck
          <input
            type="file"
            accept=".json"
            onChange={handleImportDeck}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
}
