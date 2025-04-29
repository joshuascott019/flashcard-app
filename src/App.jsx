import { useState, useEffect } from 'react';
import Flashcard from './assets/components/Flashcard.jsx';
import CategorySelector from './assets/components/CategorySelector.jsx';
import SortOptions from './assets/components/SortOptions.jsx';
import JsonIO from './assets/components/JsonIO.jsx';

function App() {
  const [categories, setCategories] = useState({});
  const [currentCategory, setCurrentCategory] = useState('default');
  const [sortMode, setSortMode] = useState('byCreation');

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('flashcardData');
    if (stored) setCategories(JSON.parse(stored));
  }, []);

  // Auto-save on change
  useEffect(() => {
    localStorage.setItem('flashcardData', JSON.stringify(categories));
  }, [categories]);

  const cards = categories[currentCategory] || [];
  const sortedCards =
    sortMode === 'random' ? [...cards].sort(() => Math.random() - 0.5) : cards;

  const addCard = (front, back) => {
    setCategories((prev) => {
      const list = prev[currentCategory] || [];
      return { ...prev, [currentCategory]: [...list, { front, back }] };
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Flashcard App</h1>
      <div className="flex gap-4 mb-4">
        <CategorySelector
          categories={Object.keys(categories)}
          current={currentCategory}
          onChange={setCurrentCategory}
          onAdd={(name) => setCategories((prev) => ({ ...prev, [name]: [] }))}
        />
        <SortOptions mode={sortMode} onChange={setSortMode} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedCards.map((card, idx) => (
          <Flashcard key={idx} front={card.front} back={card.back} />
        ))}
      </div>
      <div className="mt-6">
        <JsonIO data={categories} onLoad={setCategories} />
      </div>
    </div>
  );
}

export default App;
