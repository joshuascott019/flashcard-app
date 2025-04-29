import { useState } from 'react';

export default function Flashcard({ front, back }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      onClick={() => setFlipped(!flipped)}
      className={`relative w-full h-48 bg-white rounded-2xl shadow-lg p-4 cursor-pointer transform transition-transform duration-300 ${
        flipped ? 'rotate-y-180' : ''
      }`}
      style={{ perspective: '1000px' }}
    >
      <div
        className={`absolute inset-0 backface-hidden flex items-center justify-center text-xl p-2 ${
          flipped ? 'hidden' : ''
        }`}
      >
        {front}
      </div>
      <div
        className="absolute inset-0 backface-hidden flex items-center justify-center text-xl p-2 rotate-y-180"
        style={{ transform: 'rotateY(180deg)' }}
      >
        {back}
      </div>
    </div>
  );
}
