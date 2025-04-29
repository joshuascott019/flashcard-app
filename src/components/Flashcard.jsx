import { useState } from 'react';

export default function Flashcard({ front, back, onDelete }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      className="relative w-full h-48 cursor-pointer"
      style={{ perspective: '1000px' }}
      onClick={() => setFlipped(!flipped)}
    >
      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute top-2 right-2 z-10 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
      >
        ×
      </button>
      <div
        className="relative w-full h-full transition-transform duration-500"
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        <div
          className="absolute inset-0 bg-white rounded-2xl shadow-lg flex items-center justify-center text-xl p-4"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {front}
        </div>
        <div
          className="absolute inset-0 bg-white rounded-2xl shadow-lg flex items-center justify-center text-xl p-4"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          {back}
        </div>
      </div>
    </div>
  );
}
