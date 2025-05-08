// ===== components/ManageModal.jsx =====
import React from 'react';

export default function ManageModal({ cards = [], onUpdate, onClose }) {
  const handleQuestionChange = (idx, value) => {
    const updated = [...cards];
    updated[idx].question = value;
    onUpdate(updated);
  };

  const handleAnswerChange = (idx, value) => {
    const updated = [...cards];
    updated[idx].answer = value;
    onUpdate(updated);
  };

  const handleDelete = (idx) => {
    if (!window.confirm('Delete this card?')) return;
    const updated = cards.filter((_, i) => i !== idx);
    onUpdate(updated);
  };

  const handleAddCard = () => {
    const updated = [
      ...cards,
      { id: Date.now(), question: 'Front:[NO Text]', answer: 'Back:[NO Text]' },
    ];
    onUpdate(updated);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-11/12 max-w-4xl h-5/6 overflow-auto shadow-lg relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Manage Deck</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-black">
            ✕
          </button>
        </div>

        <div className="space-y-2 mb-16">
          {cards.map((card, idx) => (
            <div key={card.id} className="flex gap-2 items-center">
              <input
                className="flex-1 border p-1 rounded"
                value={card.question}
                onChange={(e) => handleQuestionChange(idx, e.target.value)}
              />
              <input
                className="flex-1 border p-1 rounded"
                value={card.answer}
                onChange={(e) => handleAnswerChange(idx, e.target.value)}
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

        <button
          onClick={handleAddCard}
          className="w-full px-4 py-2 bg-slate-500 text-white rounded hover:bg-slate-600 sticky bottom-0"
        >
          Add Card
        </button>
      </div>
    </div>
  );
}
