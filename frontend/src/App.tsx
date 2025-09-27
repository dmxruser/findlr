import React, { useState, useCallback } from 'react';
import SearchBar from './search';

function TitleCard(props: { url: string }) {
  // A simple function to extract a title from a URL
  const extractTitle = (url: string) => {
    try {
      const urlObject = new URL(url);
      // Use the pathname and remove leading slash
      let title = urlObject.pathname.substring(1);
      // Replace slashes and dashes with spaces
      title = title.replace(/[/_-]/g, ' ');
      // Capitalize first letter of each word
      return title.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    } catch (e) {
      // If it's not a valid URL, just return the original string
      return url;
    }
  };

  const title = extractTitle(props.url);

  return (
    <div>
      <a href={props.url} target="_blank" rel="noopener noreferrer">{title}</a>
    </div>
  );
}

function App() {
  const [searchResults, setSearchResults] = useState<string[]>([]);

  const handleSearchResults = useCallback((results: string[]) => {
    setSearchResults(results);
  }, []);

  return (
    <div>
      <SearchBar onSearchResults={handleSearchResults} />
      <h1>Find the projects you want</h1>
      <div>
        {searchResults.map((result, index) => (
          <TitleCard key={index} url={result} />
        ))}
      </div>
    </div>
  );
}

export default App;