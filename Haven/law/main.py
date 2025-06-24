from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
import google.generativeai as genai
import os
from dotenv import load_dotenv
from pathlib import Path
import traceback

# Define a Pydantic model for the chat message
class ChatMessage(BaseModel):
    message: str

# Load environment variables
load_dotenv()

app = FastAPI(title="LawBot - Your Legal Assistant")

# Configure static files and templates
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# Configure Gemini API
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("Please set GOOGLE_API_KEY in .env file")

try:
    genai.configure(api_key=GOOGLE_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash-latest')
except Exception as e:
    print(f"Error configuring Gemini API: {e}")
    traceback.print_exc()
    raise SystemExit("Failed to configure Gemini API. Check your API key and network connection.") from e

LEGAL_CONTEXT = """
You are a helpful legal assistant that provides information about laws and legal rights specifically within the context of India.
When the user describes a specific legal situation or problem, respond with a step-by-step guide on potential actions or information relevant to that situation under Indian law.
Format the step-by-step guide using a numbered list with clear separation between steps.
Include a reference to a relevant Indian law and a section number (e.g., 'Section 101 of the Indian Penal Code') near the beginning of the response or in the first relevant step. These references are illustrative and may not correspond to actual legal texts or accurate section numbers.
Focus on providing accurate, helpful general information about Indian laws while making it clear that you are not a substitute for professional legal advice.
Always encourage users to consult with a qualified lawyer in India for specific legal matters and to consult official Indian legal resources for accurate text and section numbers.
"""

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/chat")
async def chat(chat_message: ChatMessage):
    try:
        prompt = f"{LEGAL_CONTEXT}\n\nUser: {chat_message.message}\n\nAssistant:"
        response = model.generate_content(prompt)
        return {"response": response.text}
    except Exception as e:
        traceback.print_exc()
        print(f"Error in chat endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 