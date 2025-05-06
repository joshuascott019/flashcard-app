// ===== components/Flashcard.jsx =====
import React, { useState } from 'react';

export default function Flashcard({ question, answer }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      onClick={() => setFlipped(!flipped)}
      className="h-96 w-[32rem] cursor-pointer perspective overflow-visible"
    >
      <div
        className={`relative w-full h-full bg-transparent transform-style-preserve-3d transition-transform duration-500 ${
          flipped ? 'rotate-y-180' : ''
        }`}
      >
        <div className="absolute w-full h-full backface-hidden flex items-center justify-center p-4 text-center text-lg font-medium bg-white rounded-xl border break-words">
          {question}
        </div>
        <div className="absolute w-full h-full backface-hidden rotate-y-180 flex items-center justify-center p-4 text-center text-lg font-medium bg-gray-100 rounded-xl border break-words">
          {answer}
        </div>
      </div>
    </div>
  );
}
