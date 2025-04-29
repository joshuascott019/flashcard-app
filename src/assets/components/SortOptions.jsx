export default function SortOptions({ mode, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <button
        className={`px-4 py-2 rounded ${
          mode === 'byCreation' ? 'bg-green-500 text-white' : 'bg-gray-200'
        }`}
        onClick={() => onChange('byCreation')}
      >
        By Creation
      </button>
      <button
        className={`px-4 py-2 rounded ${
          mode === 'random' ? 'bg-green-500 text-white' : 'bg-gray-200'
        }`}
        onClick={() => onChange('random')}
      >
        Random
      </button>
    </div>
  );
}
