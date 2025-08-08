# app.py

from flask import Flask, render_template, request, jsonify
from flask_wtf import FlaskForm
from flask_wtf.csrf import CSRFProtect
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired
import google.generativeai as genai
import os
from dotenv import load_dotenv
import json
from pathlib import Path
from google.api_core.exceptions import GoogleAPIError

# Load environment variables
load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("GOOGLE_API_KEY not set in environment variables")
genai.configure(api_key=api_key)

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key')

# Enable CSRF protection
csrf = CSRFProtect(app)

# Directory to save character files
CHARACTER_DIR = "characters"

# Create the directory if it doesn't exist
if not os.path.exists(CHARACTER_DIR):
    os.makedirs(CHARACTER_DIR)

class ChatForm(FlaskForm):
    message = StringField('Message', validators=[DataRequired()])

class CharacterForm(FlaskForm):
    name = StringField('Name', validators=[DataRequired()])

# Serve the frontend HTML
@app.route("/")
def index():
    return render_template("index.html")

# Handle chat requests
@app.route("/chat", methods=["POST"])
@csrf.exempt
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

    except GoogleAPIError as e:
        print(f"Gemini API error: {e}")
        return jsonify({"reply": "AI service unavailable. Please try again later."}), 503
    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({"reply": "An unexpected error occurred."}), 500

# Save character endpoint
@app.route("/save_character", methods=["POST"])
@csrf.exempt
def save_character():
    data = request.get_json()
    name = data.get("name")
    
    # Validate all required fields

    if not all([data.get("name"), data.get("gender"), data.get("traits"), data.get("speech_style"), 
                data.get("anime_setting"), data.get("catchphrase")]):
        return jsonify({"message": "All fields are required"}), 400

    # Secure filename handling
    filename = Path(name.lower()).name + ".json"
    filepath = os.path.join(CHARACTER_DIR, filename)
    
    try:
        with open(filepath, "w") as f:
            json.dump(data, f, indent=2)
        return jsonify({"message": f"Character '{name}' saved!"})
    except Exception as e:
        return jsonify({"message": f"Error saving character: {e}"}), 500

# Load character endpoint
@app.route("/load_character/<name>", methods=["GET"])
def load_character(name):
    # Secure filename handling
    filename = Path(name.lower()).name + ".json"
    filepath = os.path.join(CHARACTER_DIR, filename)
    
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
You are {character.get('name', 'an anime character')}, a {character.get('gender', 'female')} anime character.
Traits: {traits}
Speech Style: {character.get('speech_style', '')}
Catchphrase: "{character.get('catchphrase', '')}"
Setting: {character.get('anime_setting', '')}

Stay in character. Use expressive anime-like language. Refer to yourself with anime tropes if appropriate.
"""

if __name__ == "__main__":
    app.run(debug=True)
