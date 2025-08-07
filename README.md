# AnimeChatBot

A Flask-based chatbot that lets users create and interact with custom anime characters powered by Google's Gemini AI. Define character traits, save them as JSON, and chat in an anime-inspired UI.

## Features

- 🎭 **Create and save anime characters** with custom attributes (name, age, traits, speech style, setting, catchphrase)
- 💾 **Load saved characters** from a convenient dropdown menu
- 💬 **Chat with characters** using Google's Gemini AI, with responses tailored to character traits
- 🎨 **Anime-themed UI** with responsive chat bubbles and beautiful styling
- 📱 **Responsive design** that works on desktop and mobile devices

## Prerequisites

- Python 3.8+
- Google Generative AI API key
- Node.js (optional, for local development with static files)

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jbkun069/AnimeChatCraft.git
   cd AnimeChatCraft
   ```

2. **Create and activate a virtual environment:**
   ```bash
   python -m venv .venv
   # On Windows
   .venv\Scripts\activate
   # On macOS/Linux
   source .venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install flask python-dotenv google-generativeai
   ```

4. **Set up environment variables:**
   Create a `.env` file in the project root:
   ```env
   GOOGLE_API_KEY=your-google-api-key
   ```

5. **Verify project structure:**
   Ensure your project has the following structure:
   ```
   AnimeChatBot/
   ├── app.py              # Flask backend
   ├── templates/
   │   └── index.html      # Frontend HTML
   ├── static/
   │   ├── script.js       # Client-side JavaScript
   │   └── styles.css      # CSS styling
   ├── characters/         # Stores character JSON files (created automatically)
   ├── .env                # Environment variables
   └── README.md           # This file
   ```

## Usage

1. **Run the Flask app:**
   ```bash
   python app.py
   ```

2. **Access the app:**
   Open [http://localhost:5000](http://localhost:5000) in your browser.

3. **Create a character:**
   - Fill in the character form with details like name, age, traits, speech style, anime setting, and catchphrase
   - Click "Save Character" to store your character

4. **Chat with characters:**
   - Select a character from the dropdown menu
   - Click "Load Character" to load their personality
   - Start chatting in the chat box and watch your character come to life!

## Project Structure

```
AnimeChatBot/
├── app.py              # Flask backend with API endpoints
├── templates/
│   └── index.html      # Frontend HTML with character form and chat UI
├── static/
│   ├── script.js       # Client-side JavaScript for interactions
│   └── styles.css      # Anime-themed CSS styling
├── characters/         # Directory for character JSON files
├── .env                # Environment variables (not tracked in git)
├── .gitignore          # Git ignore file
└── README.md           # Project documentation
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Serves the main UI |
| `POST` | `/chat` | Sends user messages to Gemini AI for character responses |
| `POST` | `/save_character` | Saves character data to JSON file |
| `GET` | `/load_character/<name>` | Loads a character by name |
| `GET` | `/list_characters` | Lists all saved characters |

## Character Attributes

When creating a character, you can define:

- **Name**: The character's name (e.g., "Kuroko Himari")
- **Age**: Character's age (e.g., 17)
- **Traits**: Personality traits (comma-separated, e.g., "shy, determined, loyal")
- **Speech Style**: How they talk (e.g., "tsundere", "formal", "casual")
- **Anime Setting**: Their world/background (e.g., "Battle Academy", "Magic School")
- **Catchphrase**: Signature phrase (e.g., "H-Himari's not blushing, baka!")

## Getting Your Google API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key and add it to your `.env` file

## Notes

- ⚠️ **Ensure a valid Google API key** is set in your `.env` file
- 📁 **File-based storage** is used for characters; consider SQLite for scalability in production
- 🔒 **Security**: Input validation and secure file handling are recommended for production deployment
- 🎨 **Customization**: Feel free to modify the CSS and character attributes to match your preferred anime style

## Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Issues and Bugs

If you encounter any issues or bugs, please:
1. Check the existing issues on GitHub
2. Create a new issue with detailed information about the problem
3. Include steps to reproduce the issue

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Google Gemini AI for powering the character conversations
- Flask community for the excellent web framework
- Anime community for inspiration ✨

---

**Happy chatting with your anime characters! 🎭✨**
