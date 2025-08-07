// script.js

let characterProfile = {}; // Holds the user-defined character data

// Capture character info from form inputs and save to server
async function saveCharacter() {
  // Validate name
  const name = document.getElementById("name").value.trim();
  if (!name) {
    alert("Character name is required!");
    return;
  }

  characterProfile = {
    name: name,
    age: document.getElementById("age").value,
    traits: document.getElementById("traits").value.split(",").map(s => s.trim()),
    speech_style: document.getElementById("speech_style").value,
    anime_setting: document.getElementById("anime_setting").value,
    catchphrase: document.getElementById("catchphrase").value
  };

  try {
    // Save to server
    const response = await fetch("/save_character", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(characterProfile)
    });

    const data = await response.json();
    alert(data.message);
    
    // Update character select dropdown
    await loadCharacterList();
  } catch (error) {
    console.error("Error saving character:", error);
    alert("Failed to save character. Please try again.");
  }
}

// Send message to Flask backend
async function sendMessage() {
  const userInput = document.getElementById("user-input").value;
  if (!userInput.trim()) return;

  // Display user message
  appendMessage("You", userInput, "user-msg");

  // Clear input
  document.getElementById("user-input").value = "";

  // Prepare request payload
  const payload = {
    message: userInput,
    character: characterProfile
  };

  try {
    const response = await fetch("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    // Display bot reply
    appendMessage(characterProfile.name || "Bot", data.reply, "bot-msg");
  } catch (error) {
    console.error("Error:", error);
    appendMessage("System", "Something went wrong. Please try again later.", "bot-msg");
  }
}

// Append messages to chat-box
function appendMessage(sender, text, className) {
  const chatBox = document.getElementById("chat-box");
  const messageDiv = document.createElement("div");
  messageDiv.classList.add(className);
  messageDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatBox.appendChild(messageDiv);

  // Auto scroll to bottom
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Load a character from the server
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
    
    // Update form fields with loaded data
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

// Get list of saved characters for dropdown
async function loadCharacterList() {
  // For this example, we'll add an endpoint to list characters
  try {
    const response = await fetch("/list_characters");
    if (response.ok) {
      const characters = await response.json();
      const select = document.getElementById("character-select");
      
      // Clear existing options
      select.innerHTML = '<option value="">Select a character</option>';
      
      // Add options for each character
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

// Initialize the page
document.addEventListener("DOMContentLoaded", async () => {
  await loadCharacterList();
});
