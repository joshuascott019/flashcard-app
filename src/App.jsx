// ===== App.jsx =====
import React, { useState, useEffect } from 'react';
import Flashcard from './components/Flashcard';
import SettingsModal from './components/SettingsModal';
import ManageModal from './components/ManageModal';

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
  const [showManage, setShowManage] = useState(false);
  const [flipKey, setFlipKey] = useState(0);
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
  }, [cards, hasLoaded, currentIndex]);

  const addCard = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) return;
    const newCard = {
      id: Date.now(),
      question: newQuestion,
      answer: newAnswer,
    };
    const updated = [...cards, newCard];
    setCards(updated);
    setCurrentIndex(cards.length);
    setNewQuestion('');
    setNewAnswer('');
    setShowModal(false);
    setFlipKey((fk) => fk + 1);
  };

  const saveToFile = async (defaultName) => {
    const data = JSON.stringify(cards, null, 2);
    if (window.showSaveFilePicker) {
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: defaultName.endsWith('.json')
            ? defaultName
            : `${defaultName}.json`,
          types: [
            {
              description: 'JSON Files',
              accept: { 'application/json': ['.json'] },
            },
          ],
        });
        const writable = await handle.createWritable();
        await writable.write(data);
        await writable.close();
      } catch {
        // ignore
      }
    } else {
      alert('Your browser does not support direct directory selection.');
    }
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
        setFlipKey((fk) => fk + 1);
      } catch {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  const handleSave = () => {
    saveToFile('FlashcardApp - ');
    setShowSettings(false);
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all flashcards?')) {
      setCards([]);
      localStorage.removeItem(STORAGE_KEY);
      setCurrentIndex(0);
      setFlipKey((fk) => fk + 1);
      setShowSettings(false);
    }
  };

  const goPrev = () => {
    setCurrentIndex((i) => {
      const ni = i > 0 ? i - 1 : i;
      setFlipKey((fk) => fk + 1);
      return ni;
    });
  };

  const goNext = () => {
    setCurrentIndex((i) => {
      const ni = i < cards.length - 1 ? i + 1 : i;
      setFlipKey((fk) => fk + 1);
      return ni;
    });
  };

  return (
    <div
      className="
      relative min-h-screen bg-gray-100
      p-4 sm:p-6 md:p-8       /* padding scales up */
      flex flex-col items-center gap-6
    "
    >
      <button
        onClick={() => setShowSettings(true)}
        className="absolute top-4 right-4 p-2 bg-gray-300 rounded hover:bg-gray-400"
      >
        ⚙️
      </button>

      <h1 className="text-3xl font-bold text-center">Flashcard App</h1>

      {cards.length > 0 ? (
        <>
          <div
            className="
            flex flex-col items-center gap-4    /* stack on mobile */
            
          "
          >
            <Flashcard
              key={flipKey}
              question={cards[currentIndex].question}
              answer={cards[currentIndex].answer}
            />
            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={goPrev}
                disabled={currentIndex === 0}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              >
                &larr;
              </button>
              <div className="text-lg">{`${currentIndex + 1}/${
                cards.length
              }`}</div>
              <button
                onClick={goNext}
                disabled={currentIndex === cards.length - 1}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              >
                &rarr;
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="text-gray-500">
          No flashcards yet. Click "Add Card" to create one.
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Card
        </button>
      </div>

      <button
        onClick={() => setShowManage(true)}
        className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
      >
        Manage Deck
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-80 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Add New Flashcard</h2>
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

      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          onSave={handleSave}
          onLoad={loadFromFile}
          onClear={handleClear}
          onManage={() => {
            setShowSettings(false);
            setShowManage(true);
          }}
        />
      )}

      {showManage && (
        <ManageModal
          cards={cards}
          onUpdate={setCards}
          onClose={() => setShowManage(false)}
        />
      )}
    </div>
  );
}
