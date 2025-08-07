# app.py

from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
import os
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

app = Flask(__name__)

# Directory to save character files
CHARACTER_DIR = "characters"

# Create the directory if it doesn't exist
if not os.path.exists(CHARACTER_DIR):
    os.makedirs(CHARACTER_DIR)

# Serve the frontend HTML
@app.route("/")
def index():
    return render_template("index.html")

# Handle chat requests
@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()

    user_message = data.get("message", "")
    character = data.get("character", {})

    # Basic error handling
    if not user_message or not character:
        return jsonify({"reply": "Missing message or character data."}), 400

    # Build system prompt based on character traits
    system_prompt = build_prompt(character)

    try:
        # Call Google Generative AI API
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Combine system prompt and user message for Gemini
        full_prompt = f"{system_prompt}\n\nUser: {user_message}\nCharacter:"
        
        response = model.generate_content(full_prompt)
        reply = response.text.strip().removeprefix("Character:").strip()
        return jsonify({"reply": reply})

    except Exception as e:
        print(f"Gemini error: {e}")
        return jsonify({"reply": "Error talking to the AI."}), 500

# Save character endpoint
@app.route("/save_character", methods=["POST"])
def save_character():
    data = request.get_json()
    name = data.get("name")
    if not name:
        return jsonify({"message": "Character name is required"}), 400

    filepath = os.path.join(CHARACTER_DIR, f"{name.lower()}.json")
    try:
        with open(filepath, "w") as f:
            json.dump(data, f, indent=2)
        return jsonify({"message": f"Character '{name}' saved!"})
    except Exception as e:
        return jsonify({"message": f"Error saving character: {e}"}), 500

# Load character endpoint
@app.route("/load_character/<name>", methods=["GET"])
def load_character(name):
    filepath = os.path.join(CHARACTER_DIR, f"{name.lower()}.json")
    if not os.path.exists(filepath):
        return jsonify({"message": f"Character '{name}' not found."}), 404

    try:
        with open(filepath, "r") as f:
            character = json.load(f)
        return jsonify(character)
    except Exception as e:
        return jsonify({"message": f"Error loading character: {e}"}), 500

# List all available characters
@app.route("/list_characters", methods=["GET"])
def list_characters():
    try:
        if not os.path.exists(CHARACTER_DIR):
            return jsonify([])
        
        files = [f.split('.')[0] for f in os.listdir(CHARACTER_DIR) 
                if f.endswith('.json')]
        return jsonify(files)
    except Exception as e:
        return jsonify({"message": f"Error listing characters: {e}"}), 500

# Helper function to build prompt
def build_prompt(character):
    traits = ", ".join(character.get("traits", []))
    return f"""
You are {character.get('name', 'an anime character')}, a {character.get('age', '16')}-year-old anime character.
Traits: {traits}
Speech Style: {character.get('speech_style', '')}
Catchphrase: "{character.get('catchphrase', '')}"
Setting: {character.get('anime_setting', '')}

Stay in character. Use expressive anime-like language. Refer to yourself with anime tropes if appropriate.
"""

if __name__ == "__main__":
    app.run(debug=True)
