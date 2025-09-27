import React, { useState, useEffect, useRef } from 'react';

interface SearchBarProps {
  onSearchResults: (results: any[]) => void;
}

const SearchBar = ({ onSearchResults }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (searchTerm.trim() === '') {
      onSearchResults([]);
      return;
    }

    const debounceTimer = setTimeout(() => {
      fetch(`http://localhost:8000/search?q=${searchTerm}`)
        .then(response => response.json())
        .then(data => {
          onSearchResults(data.results);
        })
        .catch(error => console.error('Error fetching search results:', error));
    }, 500);

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [searchTerm, onSearchResults]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <input
      type="text"
      placeholder="Search..."
      value={searchTerm}
      onChange={handleChange}
    />
  );
};

export default SearchBar;
