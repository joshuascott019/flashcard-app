import React, { useState, useEffect } from 'react';
import Flashcard from './components/Flashcard';
import SettingsModal from './components/SettingsModal';

const STORAGE_KEY = 'flashcards';

export default function App() {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [questionFocused, setQuestionFocused] = useState(false);
  const [answerFocused, setAnswerFocused] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [flipKey, setFlipKey] = useState(0); // Used to reset flip
  const [hasLoaded, setHasLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setCards(JSON.parse(stored));
    setHasLoaded(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (hasLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
      if (currentIndex >= cards.length) setCurrentIndex(cards.length - 1);
    }
  }, [cards, hasLoaded]);

  const addCard = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) return;
    const newCard = {
      id: Date.now(),
      question: newQuestion,
      answer: newAnswer,
    };
    const oldLen = cards.length;
    const updatedCards = [...cards, newCard];
    setCards(updatedCards);
    setCurrentIndex(oldLen);
    setNewQuestion('');
    setNewAnswer('');
    setShowModal(false);
    setFlipKey((prev) => prev + 1); // Reset flip
  };

  const saveToFile = (filename) => {
    const data = JSON.stringify(cards, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const nameWithExt = filename.endsWith('.json')
      ? filename
      : filename + '.json';
    a.download = nameWithExt;
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadFromFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const imported = JSON.parse(evt.target.result);
        setCards(imported);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(imported));
        setCurrentIndex(0);
        setShowSettings(false);
        setFlipKey((prev) => prev + 1); // Reset flip
      } catch {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  const handleSave = () => {
    const defaultName = 'FlashcardApp - ';
    const fname = window.prompt('Enter filename', defaultName);
    if (!fname || fname.trim() === '') {
      setShowSettings(false);
      return;
    }
    saveToFile(fname);
    setShowSettings(false);
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all flashcards?')) {
      setCards([]);
      localStorage.removeItem(STORAGE_KEY);
      setCurrentIndex(0);
      setFlipKey((prev) => prev + 1);
      setShowSettings(false);
    }
  };

  const goPrev = () => {
    setCurrentIndex((i) => {
      const newIndex = i > 0 ? i - 1 : i;
      setFlipKey((prev) => prev + 1);
      return newIndex;
    });
  };

  const goNext = () => {
    setCurrentIndex((i) => {
      const newIndex = i < cards.length - 1 ? i + 1 : i;
      setFlipKey((prev) => prev + 1);
      return newIndex;
    });
  };

  return (
    <div className="relative min-h-screen bg-gray-100 flex flex-col items-center p-6 gap-6">
      {/* Settings Button */}
      <button
        onClick={() => setShowSettings(true)}
        className="absolute top-4 right-4 p-2 bg-gray-300 rounded hover:bg-gray-400"
      >
        ⚙️
      </button>

      {/* Title */}
      <h1 className="text-3xl font-bold text-center">Flashcard App</h1>

      {/* Card Display */}
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
              key={flipKey}
              question={cards[currentIndex].question}
              answer={cards[currentIndex].answer}
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

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Card
        </button>
      </div>

      {/* Add Card Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-80 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Add New Flashcard</h2>
            {/* Question Input */}
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="Question"
                maxLength={30}
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                onFocus={() => setQuestionFocused(true)}
                onBlur={() => setQuestionFocused(false)}
                className="w-full border p-2 rounded"
              />
              {questionFocused && (
                <div className="absolute top-0 right-0 mt-1 mr-2 text-xs text-gray-500">
                  {newQuestion.length}/30
                </div>
              )}
            </div>
            {/* Answer Input */}
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Answer"
                maxLength={30}
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                onFocus={() => setAnswerFocused(true)}
                onBlur={() => setAnswerFocused(false)}
                className="w-full border p-2 rounded"
              />
              {answerFocused && (
                <div className="absolute top-0 right-0 mt-1 mr-2 text-xs text-gray-500">
                  {newAnswer.length}/30
                </div>
              )}
            </div>
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

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          onSave={handleSave}
          onLoad={loadFromFile}
          onClear={handleClear}
        />
      )}
    </div>
  );
}
