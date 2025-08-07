// script.js

let characterProfile = {};

async function saveCharacter() {
  const name = document.getElementById("name").value.trim();
  const age = document.getElementById("age").value.trim();
  const traits = document.getElementById("traits").value.trim();
  const speech_style = document.getElementById("speech_style").value.trim();
  const anime_setting = document.getElementById("anime_setting").value.trim();
  const catchphrase = document.getElementById("catchphrase").value.trim();

  if (!name || !age || isNaN(age) || !traits || !speech_style || !anime_setting || !catchphrase) {
    alert("All fields are required, and age must be a number!");
    return;
  }

  characterProfile = {
    name: name,
    age: age,
    traits: traits.split(",").map(s => s.trim()).filter(s => s),
    speech_style: speech_style,
    anime_setting: anime_setting,
    catchphrase: catchphrase
  };

  try {
    const response = await fetch("/save_character", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(characterProfile)
    });
    const data = await response.json();
    alert(data.message);
    await loadCharacterList();
    document.getElementById("character-select").value = "";
  } catch (error) {
    console.error("Error saving character:", error);
    alert("Failed to save character. Please try again.");
  }
}

async function sendMessage() {
  const userInput = document.getElementById("user-input").value.trim();
  if (!userInput) return;
  
  appendMessage("You", userInput, "user-msg");
  document.getElementById("user-input").value = "";
  
  const payload = { message: userInput, character: characterProfile };
  
  try {
    const response = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    appendMessage(characterProfile.name || "Bot", data.reply, "bot-msg");
  } catch (error) {
    console.error("Error:", error);
    appendMessage("System", "Something went wrong. Please try again later.", "bot-msg");
  }
}

function appendMessage(sender, text, className) {
  const chatBox = document.getElementById("chat-box");
  const messageDiv = document.createElement("div");
  messageDiv.classList.add(className);
  messageDiv.textContent = `${sender}: ${text}`;
  chatBox.appendChild(messageDiv);
  
  // Limit chat history to prevent memory issues
  if (chatBox.children.length > 100) {
    chatBox.removeChild(chatBox.firstChild);
  }
  
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function loadCharacter() {
  const select = document.getElementById("character-select");
  const selectedName = select.value;
  
  if (!selectedName) {
    alert("Please select a character to load");
    return;
  }
  
  try {
    const response = await fetch(`/load_character/${encodeURIComponent(selectedName)}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to load character");
    }
    
    characterProfile = await response.json();
    
    document.getElementById("name").value = characterProfile.name || "";
    document.getElementById("age").value = characterProfile.age || "";
    document.getElementById("traits").value = (characterProfile.traits || []).join(", ");
    document.getElementById("speech_style").value = characterProfile.speech_style || "";
    document.getElementById("anime_setting").value = characterProfile.anime_setting || "";
    document.getElementById("catchphrase").value = characterProfile.catchphrase || "";
    
    alert(`Character "${characterProfile.name}" loaded successfully!`);
  } catch (error) {
    console.error("Error loading character:", error);
    alert(error.message || "Failed to load character");
  }
}

async function loadCharacterList() {
  try {
    const response = await fetch("/list_characters");
    if (response.ok) {
      const characters = await response.json();
      const select = document.getElementById("character-select");
      
      select.innerHTML = '<option value="">Select a character</option>';
      
      characters.forEach(character => {
        const option = document.createElement("option");
        option.value = character;
        option.textContent = character;
        select.appendChild(option);
      });
    }
  } catch (error) {
    console.error("Error loading character list:", error);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadCharacterList();
  loadSavedTheme();
});

// Theme management functions
function applySelectedTheme() {
  const themeSelect = document.getElementById("theme-select");
  const selectedTheme = themeSelect.value;
  
  if (selectedTheme) {
    applyTheme(selectedTheme);
    saveTheme(selectedTheme);
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

function saveTheme(theme) {
  localStorage.setItem('selectedTheme', theme);
}

function loadSavedTheme() {
  const savedTheme = localStorage.getItem('selectedTheme') || 'light';
  applyTheme(savedTheme);
  
  // Update the select dropdown to show the current theme
  const themeSelect = document.getElementById("theme-select");
  themeSelect.value = savedTheme;
}
