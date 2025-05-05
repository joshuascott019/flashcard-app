import { useState, useEffect } from 'react';
import Flashcard from './components/Flashcard';

const STORAGE_KEY = 'flashcards';

export default function App() {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      setCards(parsed);
    }
  }, []);

  // Save to localStorage on card change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    if (currentIndex >= cards.length) {
      setCurrentIndex(cards.length - 1);
    }
  }, [cards]);

  const addCard = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) return;
    const newCard = {
      id: Date.now(),
      question: newQuestion,
      answer: newAnswer,
    };
    const oldLen = cards.length;
    setCards((prev) => [...prev, newCard]);
    setCurrentIndex(oldLen); // show newly added card
    setNewQuestion('');
    setNewAnswer('');
    setShowModal(false);
  };

  const saveToFile = () => {
    const data = JSON.stringify(cards, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flashcards.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const goPrev = () => setCurrentIndex((i) => (i > 0 ? i - 1 : i));
  const goNext = () =>
    setCurrentIndex((i) => (i < cards.length - 1 ? i + 1 : i));

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6 gap-6">
      {/* Title */}
      <h1 className="text-3xl font-bold text-center">Flashcard App</h1>

      {/* Card Display with Pagination or Placeholder */}
      {cards.length > 0 ? (
        <>
          <div className="flex items-center gap-4">
            <button
              onClick={goPrev}
              disabled={currentIndex === 0}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              &larr;
            </button>

            <Flashcard
              question={cards[currentIndex]?.question}
              answer={cards[currentIndex]?.answer}
            />

            <button
              onClick={goNext}
              disabled={currentIndex === cards.length - 1}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              &rarr;
            </button>
          </div>
          <div className="text-lg">{`${currentIndex + 1}/${cards.length}`}</div>
        </>
      ) : (
        <div className="text-gray-500">
          No flashcards yet. Click "Add Card" to create one.
        </div>
      )}

      <div className="flex gap-4">
        {/* Add New Card */}
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Card
        </button>

        {/* Export Button */}
        <button
          onClick={saveToFile}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Save to File
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-80 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Add New Flashcard</h2>
            <input
              type="text"
              placeholder="Question"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              className="w-full border p-2 mb-3 rounded"
            />
            <input
              type="text"
              placeholder="Answer"
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              className="w-full border p-2 mb-4 rounded"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={addCard}
                className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
