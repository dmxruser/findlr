import React, { useState, useEffect, useRef } from 'react';

interface SearchBarProps {
  onSearchResults: (results: any[], error: string | null, aiQuery: string | null) => void;
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
      onSearchResults([], null, null);
      return;
    }

    const debounceTimer = setTimeout(() => {
      fetch(`http://localhost:8000/search?q=${searchTerm}`)
        .then(response => {
          if (!response.ok) {
            return response.json().then(err => { throw new Error(err.detail || 'Server error') });
          }
          return response.json();
        })
        .then(data => {
          onSearchResults(data.results || [], null, data.ai_query || null);
        })
        .catch(error => {
          console.error('Error fetching search results:', error);
          onSearchResults([], error.message, null);
        });
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
