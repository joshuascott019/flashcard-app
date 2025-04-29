import { useState } from 'react';

export default function AddCardForm({ onAdd }) {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!front.trim() || !back.trim()) return;
    onAdd(front.trim(), back.trim());
    setFront('');
    setBack('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        placeholder="Front"
        value={front}
        onChange={(e) => setFront(e.target.value)}
        className="border rounded p-2 w-32"
      />
      <input
        type="text"
        placeholder="Back"
        value={back}
        onChange={(e) => setBack(e.target.value)}
        className="border rounded p-2 w-32"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white rounded px-4 py-2"
      >
        Add Card
      </button>
    </form>
  );
}
