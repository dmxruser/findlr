from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict
from ddgs import DDGS

app = FastAPI()

# This is the CORS policy. It's a magical incantation.
# You need to allow the origin of your React app.
# In a development environment, your React app runs on a different port (e.g., 3000),
# so we have to explicitly permit it.
origins = [
    "http://localhost:3000",  # Your React dev server
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Your projects data, now living in Python, where it belongs.
projects_data: List[Dict] = [
    {'id': 1, 'title': 'Unix!', 'url': '/projects/1'},
    {'id': 2, 'title': 'Eek!', 'url': '/projects/2'},
    {'id': 3, 'title': 'BlahBlah', 'url': '/projects/3'},
]

@app.get("/")
def read_root():
    """Returns a basic greeting to confirm the server is running."""
    return {"Hello": "World"}

@app.get("/projects")
def get_projects():
    """Returns the full list of projects."""
    return projects_data

@app.get("/search")
def search_duckduckgo(q: str):
    """Performs a DuckDuckGo search for GitHub repositories."""
    search_query = f"site:github.com {q}"
    print(f"Searching for: {search_query}")
    try:
        with DDGS() as ddgs:
            search_results = [r['href'] for r in ddgs.text(search_query, max_results=10)]
        print(f"Found {len(search_results)} results.")
        return {"results": search_results}
    except Exception as e:
        print(f"An error occurred during search: {e}")
        return {"results": []}


