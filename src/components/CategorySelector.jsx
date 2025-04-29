import { useState } from 'react';

export default function CategorySelector({
  categories,
  current,
  onChange,
  onAdd,
}) {
  const [newName, setNewName] = useState('');
  return (
    <div className="flex items-center gap-2">
      <select
        className="border rounded p-2"
        value={current}
        onChange={(e) => onChange(e.target.value)}
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <input
        className="border rounded p-2"
        placeholder="New category"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
      />
      <button
        type="button"
        className="bg-green-500 text-white rounded px-4 py-2"
        onClick={() => {
          onAdd(newName.trim());
          setNewName('');
        }}
      >
        Add
      </button>
    </div>
  );
}
