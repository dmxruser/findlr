import React, { useState, useEffect } from 'react';

// This interface defines the shape of our project data for TypeScript.
interface Project {
  id: number;
  title: string;
  url: string;
}

function TitleCard(props: { title: string, url: string }) {
  return (
    <div>
      <a href={props.url}>{props.title}</a>
    </div>
  );
}

function App() {
  // Create a state variable to hold the list of projects.
  const [projects, setProjects] = useState<Project[]>([]);

  // This useEffect hook will run once when the component loads.
  useEffect(() => {
    // We fetch the data from your backend endpoint.
    // Make sure your Python server is running on this address.
    fetch('http://localhost:8000/projects')
      .then(response => response.json())
      .then(data => setProjects(data))
      .catch(error => console.error('Error fetching projects:', error));
  }, []); // The empty array tells React to only run this effect once.

  return (
    <div>
      <h1>Find the projects you want</h1>
      <div>
        {/* We now use .map() to render the list from the state. */}
        {projects.map(project => (
          <TitleCard key={project.id} title={project.title} url={project.url} />
        ))}
      </div>
    </div>
  );
}

export default App;