from fastapi import FastAPI, HTTPException
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
    prompt = f"Translate the following user request into a single, concise search query for finding a project that does the thing that the person wants. Return only the search query itself, with no extra text or formatting. If you know a project name that would fit this persons query, do that instead.: {q}"
    
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash", 
            contents=prompt
        )
        
        if not response.text:
            raise HTTPException(status_code=500, detail="AI model returned an empty response.")

        ai_query = response.text.strip()
        search_query = f"{ai_query}"
        
        print(f"Refined search query: {search_query}")

        with DDGS() as ddgs:
            search_results = [r['href'] for r in ddgs.text(search_query, max_results=10)]
        
        print(f"Found {len(search_results)} results.")
        return {"results": search_results, "ai_query": ai_query}

    except Exception as e:
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=500, detail=f"An error occurred during the search: {str(e)}")


