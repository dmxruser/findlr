from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict
from ddgs import DDGS
from google import genai
app = FastAPI()

# This is the CORS policy. It's a magical incantation.
# You need to allow the origin of your React app.
# In a development environment, your React app runs on a different port (e.g., 3000),
# so we have to explicitly permit it.
origins = [
    "http://localhost:3000",  
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = genai.Client()


@app.get("/search")
def search_duckduckgo(q: str):
    """Performs a DuckDuckGo search for GitHub repositories."""
    search_query = f"site:github.com {q}"
    print(f"Searching for: {search_query}")
    try:
        with DDGS() as ddgs:
            response = client.models.generate_content(
                model="gemini-2.5-flash", contents=f"Translate the following user request into a single, concise search query for finding a GitHub repository: {q}"
            )
            outputAi = response.text
            if outputAi:
                search_results = [r['href'] for r in ddgs.text(outputAi, max_results=10)]
            else:
                search_results = []
        print(f"Found {len(search_results)} results.")
        return {"results": search_results}
    except Exception as e:
        print(f"An error occurred during search: {e}")
        return {"results": []}


