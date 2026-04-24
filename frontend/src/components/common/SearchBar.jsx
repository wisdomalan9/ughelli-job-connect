function SearchBar() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 grid md:grid-cols-4 gap-3">
      <input
        type="text"
        placeholder="Job title or keyword"
        className="border rounded-lg px-4 py-3 outline-none"
      />

      <select className="border rounded-lg px-4 py-3">
        <option>All Categories</option>
        <option>Sales Girl</option>
        <option>Cashier</option>
        <option>Driver</option>
        <option>Hotel Staff</option>
      </select>

      <select className="border rounded-lg px-4 py-3">
        <option>All Locations</option>
        <option>Ughelli Town</option>
        <option>Otovwodo</option>
        <option>Ekiugbo</option>
      </select>

      <button className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold px-4 py-3">
        Search Jobs
      </button>
    </div>
  );
}

export default SearchBar;
