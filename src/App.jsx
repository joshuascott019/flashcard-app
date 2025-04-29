import { useState, useEffect } from 'react';
import Flashcard from './components/Flashcard';
import AddCardForm from './components/AddCardForm';
import CategorySelector from './components/CategorySelector';
import SortOptions from './components/SortOptions';
import JsonIO from './components/JsonIO';

function App() {
  const [categories, setCategories] = useState({ default: [] });
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
    sortMode === 'random'
      ? [...cards].sort(() => Math.random() - 0.5)
      : [...cards].sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );

  const addCard = (front, back) => {
    const newCard = { front, back, createdAt: new Date().toISOString() };
    setCategories((prev) => {
      const list = prev[currentCategory] || [];
      return { ...prev, [currentCategory]: [...list, newCard] };
    });
  };

  const deleteCard = (idx) => {
    setCategories((prev) => {
      const list = prev[currentCategory] || [];
      const newList = list.filter((_, i) => i !== idx);
      return { ...prev, [currentCategory]: newList };
    });
  };

  const deleteCategory = (name) => {
    setCategories((prev) => {
      const { [name]: _, ...rest } = prev;
      return rest;
    });
    // choose a new current category
    const remaining = Object.keys(categories).filter((cat) => cat !== name);
    setCurrentCategory(remaining[0] || '');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Flashcard App</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <CategorySelector
          categories={Object.keys(categories)}
          current={currentCategory}
          onChange={setCurrentCategory}
          onAdd={(name) => setCategories((prev) => ({ ...prev, [name]: [] }))}
          onDelete={deleteCategory}
        />
        <SortOptions mode={sortMode} onChange={setSortMode} />
        <AddCardForm onAdd={addCard} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedCards.map((card, idx) => (
          <Flashcard
            key={idx}
            front={card.front}
            back={card.back}
            onDelete={() => deleteCard(idx)}
          />
        ))}
      </div>
      <div className="mt-8">
        <JsonIO data={categories} onLoad={setCategories} />
      </div>
    </div>
  );
}

export default App;
