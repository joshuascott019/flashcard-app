import { useState } from 'react';

export default function Flashcard({ question, answer }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      onClick={() => setFlipped(!flipped)}
      className="w-48 h-64 bg-white rounded-xl shadow-md cursor-pointer perspective"
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
          flipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front */}
        <div className="absolute w-full h-full backface-hidden flex items-center justify-center p-4 text-center text-lg font-medium bg-white rounded-xl border">
          {question}
        </div>

        {/* Back */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 flex items-center justify-center p-4 text-center text-lg font-medium bg-gray-100 rounded-xl border">
          {answer}
        </div>
      </div>
    </div>
  );
}
