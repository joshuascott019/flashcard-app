import { useState } from 'react';

export default function Flashcard({ front, back }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      onClick={() => setFlipped(!flipped)}
      className="relative w-full h-48 p-4 cursor-pointer perspective-1000"
    >
      <div
        className={`absolute inset-0 bg-white rounded-2xl shadow-lg flex items-center justify-center text-xl p-4 transition-transform duration-500 transform-style-preserve-backface ${
          flipped ? 'rotate-y-180' : ''
        }`}
      >
        {front}
      </div>
      <div
        className={`absolute inset-0 bg-white rounded-2xl shadow-lg flex items-center justify-center text-xl p-4 transition-transform duration-500 transform-style-preserve-backface rotate-y-180 ${
          flipped ? 'rotate-y-0' : 'hidden'
        }`}
      >
        {back}
      </div>
    </div>
  );
}
