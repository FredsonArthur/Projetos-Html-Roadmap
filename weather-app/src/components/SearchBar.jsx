import { useState } from "react";
import "./SearchBar.css";

function SearchBar({ onSearch }) {
  // Controla o texto digitado no campo de busca
  const [query, setQuery] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    onSearch(query);
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Enter a city name..."
        aria-label="City name"
      />
      <button type="submit">Search</button>
    </form>
  );
}

export default SearchBar;