export default function JsonIO({ data, onLoad }) {
  const download = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flashcards.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const upload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onLoad(JSON.parse(reader.result));
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex gap-4">
      <button
        className="bg-purple-500 text-white rounded px-4 py-2"
        onClick={download}
      >
        Save JSON
      </button>
      <label className="bg-purple-500 text-white rounded px-4 py-2 cursor-pointer">
        Load JSON
        <input
          type="file"
          accept="application/json"
          className="hidden"
          onChange={upload}
        />
      </label>
    </div>
  );
}
