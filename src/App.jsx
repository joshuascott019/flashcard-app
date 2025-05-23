// ===== App.jsx =====
import React, { useState, useEffect } from 'react';
import Flashcard from './components/Flashcard';
import SettingsModal from './components/SettingsModal';
import ManageModal from './components/ManageModal';
import ManageDecksModal from './components/ManageDecksModal';
import ErrorModal from './components/ErrorModal';

const STORAGE_KEY = 'flashcards';

export default function App() {
  // A “deck candidate” must be an object with string id, string name, and an array of cards
  const isDeckCandidate = (d) =>
    d &&
    typeof d === 'object' &&
    (typeof d.id === 'string' || typeof d.id === 'number') &&
    typeof d.name === 'string' &&
    Array.isArray(d.cards);

  // A “card candidate” must be an object with id, question, and answer
  const isCardCandidate = (c) =>
    c &&
    typeof c === 'object' &&
    (typeof c.id === 'string' || typeof c.id === 'number') &&
    typeof c.question === 'string' &&
    typeof c.answer === 'string';
  const [hasLoadError, setHasLoadError] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [migrationState, setMigrationState] = useState('idle'); // 'idle'|'running'|'failed'
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [questionFocused, setQuestionFocused] = useState(false);
  const [answerFocused, setAnswerFocused] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const [showManageDecks, setShowManageDecks] = useState(false);
  const [libraries, setLibraries] = useState([
    { id: Date.now(), name: 'Deck 1', cards: [] },
  ]);
  const [currentLibraryIndex, setCurrentLibraryIndex] = useState(0);
  const [flipKey, setFlipKey] = useState(0);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [loadedDeck, setLoadedDeck] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);

        // Must be an array of valid decks, each deck’s cards must be valid cards
        if (!Array.isArray(parsed) || !parsed.every(isDeckCandidate)) {
          throw new Error('Data isn’t an array of decks');
        }

        // Also enforce that every deck’s cards array contains only valid cards
        parsed.forEach((deck) => {
          if (!deck.cards.every(isCardCandidate)) {
            throw new Error(`Deck "${deck.name}" has bad cards`);
          }
        });

        setLibraries(parsed);
      }
    } catch (e) {
      console.error('Error loading flashcards:', e);
      setHasLoadError(true);
      setShowErrorModal(true);
    } finally {
      setHasLoaded(true);
    }
  }, []);

  useEffect(() => {
    // only write back if initial load succeeded
    if (hasLoaded && !hasLoadError) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(libraries));

      const len = libraries[currentLibraryIndex]?.cards.length || 0;
      if (currentIndex >= len) {
        setCurrentIndex(len - 1);
      }
    }
  }, [
    libraries,
    hasLoaded,
    currentIndex,
    currentLibraryIndex,
    hasLoadError, // add this to deps
  ]);

  useEffect(() => {
    setLoadedDeck(libraries[currentLibraryIndex]?.cards || []);
  }, [libraries, currentLibraryIndex]);

  const doMigration = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = JSON.parse(raw);

      // simple top-level array scan
      const migrated = Array.isArray(parsed)
        ? parsed
            .filter(
              (d) =>
                d &&
                typeof d === 'object' &&
                d.id &&
                d.name &&
                Array.isArray(d.cards)
            )
            .map((d) => ({
              id: String(d.id),
              name: d.name,
              cards: d.cards
                .filter(
                  (c) =>
                    c && typeof c === 'object' && c.id && c.question && c.answer
                )
                .map((c) => ({
                  id: String(c.id),
                  question: c.question,
                  answer: c.answer,
                })),
            }))
        : [];

      // require at least one deck AND one card somewhere
      const hasContent =
        migrated.length > 0 && migrated.some((d) => d.cards.length > 0);
      if (hasContent) {
        setLibraries(migrated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
        setShowErrorModal(false);
        setHasLoadError(false);
        setMigrationState('idle');
      } else {
        throw new Error('No valid decks/cards found');
      }
    } catch (err) {
      console.error('Migration failed:', err);
      setMigrationState('failed');
    }
  };

  const handleMigrate = () => {
    setMigrationState('running');
    // wait 1s so spinner is visible before running migration
    setTimeout(() => {
      doMigration();
    }, 1000);
  };

  const addCard = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) return;
    const newCard = {
      id: Date.now(),
      question: newQuestion,
      answer: newAnswer,
    };
    setLibraries((prev) =>
      prev.map((lib, idx) =>
        idx === currentLibraryIndex
          ? { ...lib, cards: [...lib.cards, newCard] }
          : lib
      )
    );
    setCurrentIndex(libraries[currentLibraryIndex].cards.length);
    setNewQuestion('');
    setNewAnswer('');
    setShowModal(false);
    setFlipKey((fk) => fk + 1);
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to reset all decks and cards?')) {
      const defaultLib = {
        id: Date.now().toString(),
        name: 'Deck 1',
        cards: [],
      };
      setLibraries([defaultLib]);
      localStorage.removeItem(STORAGE_KEY);
      setCurrentLibraryIndex(0);
      setCurrentIndex(0);
      setFlipKey((fk) => fk + 1);
      setShowSettings(false);
    }
  };

  const goPrev = () => {
    setCurrentIndex((i) => {
      const ni = cards.length ? (i > 0 ? i - 1 : cards.length - 1) : 0;
      setFlipKey((fk) => fk + 1);
      return ni;
    });
  };
  const goNext = () => {
    setCurrentIndex((i) => {
      const ni = cards.length ? (i < cards.length - 1 ? i + 1 : 0) : 0;
      setFlipKey((fk) => fk + 1);
      return ni;
    });
  };

  const shuffleCards = () => {
    const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setLibraries(shuffled);
    setCurrentIndex(0);
    setFlipKey((fk) => fk + 1);
  };

  const createNewDeck = () => {
    setLibraries((prev) => {
      const newLib = {
        id: Date.now().toString(),
        name: `Deck ${prev.length + 1}`,
        cards: [],
      };
      const newList = [...prev, newLib];
      setCurrentLibraryIndex(newList.length - 1);
      setCurrentIndex(0);
      return newList;
    });
  };
  const handleReset = () => {
    // wipe out the bad data and restore a clean default
    const defaultLib = {
      id: Date.now().toString(),
      name: 'Deck 1',
      cards: [],
    };
    setLibraries([defaultLib]);
    localStorage.removeItem(STORAGE_KEY);
    setCurrentLibraryIndex(0);
    setCurrentIndex(0);
    setHasLoadError(false);
    setShowErrorModal(false);
  };

  const shuffleLoadedDeck = () => {
    setLoadedDeck((prev) => {
      const arr = [...prev];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    });
    setFlipKey((fk) => fk + 1);
  };

  const cards = loadedDeck;

  return (
    <div
      className="
      relative min-h-screen bg-slate-100
      p-4 sm:p-6 md:p-8       /* padding scales up */
      flex flex-col items-center gap-6
    "
    >
      <button
        onClick={shuffleLoadedDeck}
        className="absolute top-4 right-16 p-2 bg-slate-300 rounded hover:bg-slate-400"
      >
        🔀
      </button>
      <button
        onClick={() => setShowSettings(true)}
        className="absolute top-4 right-4 p-2 bg-slate-300 rounded hover:bg-slate-400"
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
              question={cards[currentIndex]?.question || ''}
              answer={cards[currentIndex]?.answer || ''}
            />
            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={goPrev}
                className="px-4 py-2 bg-slate-300 rounded disabled:opacity-50"
              >
                &larr;
              </button>
              <div className="text-lg">{`${currentIndex + 1}/${
                cards.length
              }`}</div>
              <button
                onClick={goNext}
                className="px-4 py-2 bg-slate-300 rounded disabled:opacity-50"
              >
                &rarr;
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="text-slate-500">No flashcards yet.</div>
      )}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-80 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Add New Flashcard</h2>
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="Question"
                maxLength={120}
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                onFocus={() => setQuestionFocused(true)}
                onBlur={() => setQuestionFocused(false)}
                className="w-full border p-2 rounded"
              />
              {questionFocused && (
                <div className="absolute top-0 right-0 mt-1 mr-2 text-xs text-slate-500">
                  {newQuestion.length}/120
                </div>
              )}
            </div>
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Answer"
                maxLength={120}
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                onFocus={() => setAnswerFocused(true)}
                onBlur={() => setAnswerFocused(false)}
                className="w-full border p-2 rounded"
              />
              {answerFocused && (
                <div className="absolute top-0 right-0 mt-1 mr-2 text-xs text-slate-500">
                  {newAnswer.length}/120
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-slate-300 hover:bg-slate-400"
              >
                Cancel
              </button>
              <button
                onClick={addCard}
                className="px-4 py-2 rounded bg-slate-500 text-white hover:bg-slate-600"
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
          onClear={handleClear}
          onAddCard={() => {
            setShowSettings(false);
            setShowModal(true);
          }}
          onShuffle={() => {
            setShowSettings(false);
            shuffleCards();
          }}
          onManageDeck={() => {
            setShowSettings(false);
            setShowManage(true);
          }}
          onManageDecks={() => setShowManageDecks(true)}
          libraries={libraries}
          currentLibraryIndex={currentLibraryIndex}
          onLibraryChange={(newIndex) => {
            setCurrentLibraryIndex(newIndex);
            setCurrentIndex(0);
          }}
          onCreateDeck={createNewDeck}
        />
      )}

      {showManage && (
        <ManageModal
          cards={cards}
          onUpdate={(updatedCards) => {
            setLibraries((prev) =>
              prev.map((lib, i) =>
                i === currentLibraryIndex
                  ? { ...lib, cards: updatedCards }
                  : lib
              )
            );
            if (currentIndex >= updatedCards.length) {
              setCurrentIndex(updatedCards.length - 1);
            }
          }}
          onClose={() => {
            setShowManage(false);
            setShowSettings(true);
            setFlipKey((fk) => fk + 1);
          }}
          onAddCard={() => {
            setShowManage(false);
            setShowModal(true);
          }}
        />
      )}

      {showManageDecks && (
        <ManageDecksModal
          libraries={libraries}
          onUpdate={(updatedLibs) => {
            setLibraries(updatedLibs);
            const newIndex =
              currentLibraryIndex >= updatedLibs.length
                ? updatedLibs.length - 1
                : currentLibraryIndex;
            setCurrentLibraryIndex(newIndex);
            setCurrentIndex(0);
            setFlipKey((fk) => fk + 1);
          }}
          onClose={() => setShowManageDecks(false)}
        />
      )}
      {showErrorModal && (
        <ErrorModal
          migrationState={migrationState}
          onMigrate={handleMigrate}
          onReset={handleReset}
          onClose={() => setShowErrorModal(false)}
        />
      )}
    </div>
  );
}
