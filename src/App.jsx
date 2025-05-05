import { useState, useEffect } from 'react';
import Flashcard from './components/Flashcard';

const STORAGE_KEY = 'flashcards';

export default function App() {
  const [cards, setCards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setCards(JSON.parse(stored));
    }
  }, []);

  // Save to localStorage on card change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  }, [cards]);

  const addCard = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) return;
    const newCard = {
      id: Date.now(),
      question: newQuestion,
      answer: newAnswer,
    };
    setCards([...cards, newCard]);
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

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6 gap-6">
      <div className="flex flex-wrap justify-center gap-4">
        {cards.map((card) => (
          <Flashcard
            key={card.id}
            question={card.question}
            answer={card.answer}
          />
        ))}

        {/* Add New Card */}
        <button
          onClick={() => setShowModal(true)}
          className="w-48 h-64 bg-white border-2 border-dashed border-gray-400 rounded-xl flex items-center justify-center text-4xl font-bold text-gray-500 hover:bg-gray-200 transition"
        >
          +
        </button>
      </div>

      {/* Export Button */}
      <button
        onClick={saveToFile}
        className="mt-6 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Save to File
      </button>

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
