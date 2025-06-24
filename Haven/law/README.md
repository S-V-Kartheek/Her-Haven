# LawBot - AI Legal Assistant

A modern AI-powered legal assistant chatbot built with Python and FastAPI, using the Gemini API for intelligent responses.

## Features

- 🤖 AI-powered legal assistance
- 💬 Real-time chat interface
- 🎨 Modern, responsive UI
- 🔒 Secure API integration
- 📱 Mobile-friendly design

## Prerequisites

- Python 3.8 or higher
- Google API key for Gemini AI

## Setup Instructions

1. Clone the repository:
```bash
git clone <your-repo-url>
cd lawbot
```

2. Create a virtual environment and activate it:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file in the root directory and add your Google API key:
```
GOOGLE_API_KEY=your_api_key_here
```

5. Run the application:
```bash
uvicorn main:app --reload
```

6. Open your browser and navigate to `http://localhost:8000`

## Project Structure

```
lawbot/
├── main.py              # FastAPI application
├── requirements.txt     # Python dependencies
├── static/             # Static files
│   ├── script.js       # Frontend JavaScript
│   └── styles.css      # Custom CSS
├── templates/          # HTML templates
│   └── index.html      # Main page template
└── .env               # Environment variables (create this)
```

## Usage

1. Type your legal question in the chat input
2. Press Enter or click Send
3. Receive AI-powered responses about legal matters

## Important Note

This chatbot is designed to provide general legal information and should not be considered a substitute for professional legal advice. Always consult with a qualified lawyer for specific legal matters.

## License

MIT License 