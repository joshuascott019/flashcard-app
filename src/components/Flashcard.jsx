import { useState } from 'react';

export default function Flashcard({ question, answer }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      onClick={() => setFlipped(!flipped)}
      className="w-48 h-64 cursor-pointer perspective overflow-visible"
    >
      <div
        className={`relative w-full h-full bg-transparent transform-style-preserve-3d transition-transform duration-500 ${
          flipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front */}
        <div className="absolute w-full h-full backface-hidden flex items-center justify-center p-4 text-center text-lg font-medium bg-white rounded-xl border break-all">
          {question}
        </div>

        {/* Back */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 flex items-center justify-center p-4 text-center text-lg font-medium bg-gray-100 rounded-xl border break-all">
          {answer}
        </div>
      </div>
    </div>
  );
}
